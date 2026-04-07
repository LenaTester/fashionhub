pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:18
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
        PLAYWRIGHT_ENV = "${params.ENVIRONMENT}"
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

        stage('Load Environment Variables') {
            steps {
                container('node') {
                    sh '''
                        echo "Loading environment variables from .env..."
                        if [ -f .env ]; then
                            set -a
                            source .env
                            set +a
                        else
                            echo "Warning: .env file not found"
                        fi
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
                                echo "Running Playwright tests on ${PLAYWRIGHT_ENV} environment with ${BROWSER} browser(s)..."
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

        stage('Generate Report') {
            steps {
                container('node') {
                    sh '''
                        echo "Test execution completed. Report generated at playwright-report/index.html"
                    '''
                }
            }
        }
    }

    post {
        always {
            container('node') {
                script {
                    echo "Collecting test results..."
                }
                
                // Publish HTML report
                publishHTML([
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Test Report',
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true
                ])

                // Archive test results
                archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
            }
        }

        success {
            echo '✓ All tests passed successfully!'
        }

        failure {
            echo '✗ Tests failed. Check the Playwright Test Report for details.'
        }

        unstable {
            echo '⚠ Some tests were unstable.'
        }

        cleanup {
            deleteDir()
        }
    }
}
