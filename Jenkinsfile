pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:22
    command:
    - sleep
    args:
    - 99d
    resources:
      requests:
        memory: "512Mi"
        cpu: "500m"
      limits:
        memory: "1Gi"
        cpu: "1000m"
  - name: docker
    image: docker:dind
    securityContext:
      privileged: true
    resources:
      requests:
        memory: "512Mi"
        cpu: "500m"
      limits:
        memory: "1Gi"
        cpu: "1000m"
  volumes:
  - name: docker-socket
    hostPath:
      path: /var/run/docker.sock
'''
        }
    }

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['production', 'staging', 'local'],
            description: 'Select the environment to test against'
        )
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit', 'all'],
            description: 'Select which browser(s) to run tests on'
        )
    }

    environment {
        NODE_ENV = 'test'
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                container('node') {
                    checkout scm
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                container('node') {
                    sh '''
                        echo "Installing Node.js dependencies..."
                        npm ci
                    '''
                }
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                container('node') {
                    sh '''
                        echo "Installing Playwright browsers..."
                        npx playwright install --with-deps
                    '''
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    def credsId = params.ENVIRONMENT == 'production' ? 'fashionhub-prod' : 
                                   params.ENVIRONMENT == 'staging' ? 'fashionhub-staging' : 
                                   'fashionhub-local'
                    
                    withCredentials([usernamePassword(credentialsId: credsId, 
                                                     usernameVariable: 'USER_NAME', 
                                                     passwordVariable: 'PASSWORD')]) {
                        if (params.ENVIRONMENT == 'local') {
                            container('docker') {
                                sh '''
                                    echo "Starting local app..."
                                    docker run -d --name fashionhub-app -p 4000:4000 pocketaces2/fashionhub-demo-app:latest
                                    timeout 60 bash -c 'until curl -f http://localhost:4000/fashionhub/; do sleep 2; done'
                                '''
                            }
                        }
                        container('node') {
                            sh '''
                                export PLAYWRIGHT_ENV=${ENVIRONMENT}
                                echo "Running Playwright tests on ${ENVIRONMENT} environment with ${BROWSER} browser(s)..."
                                if [ "${BROWSER}" = "all" ]; then
                                    npx playwright test
                                else
                                    npx playwright test --project=${BROWSER}
                                fi
                            '''
                        }
                        if (params.ENVIRONMENT == 'local') {
                            container('docker') {
                                sh '''
                                    echo "Stopping local app..."
                                    docker stop fashionhub-app
                                    docker rm fashionhub-app
                                '''
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            container('node') {
                sh '''
                    echo "Test execution completed."
                '''
                
                // Archive test results and reports
                archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
            }
        }

        success {
            echo '✓ All tests passed successfully!'
        }

        failure {
            echo '✗ Tests failed. Check archived reports for details.'
        }

        unstable {
            echo '⚠ Some tests were unstable.'
        }
    }
}
