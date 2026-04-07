pipeline {
    agent any

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
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "Installing Node.js dependencies..."
                    npm ci
                '''
            }
        }

        stage('Load Environment Variables') {
            steps {
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

        stage('Run Tests') {
            steps {
                sh '''
                    echo "Running Playwright tests on ${PLAYWRIGHT_ENV} environment with ${BROWSER} browser(s)..."
                    if [ "${BROWSER}" = "all" ]; then
                        npx playwright test
                    else
                        npx playwright test --project=${BROWSER}
                    fi
                '''
            }
        }

        stage('Generate Report') {
            steps {
                sh '''
                    echo "Test execution completed. Report generated at playwright-report/index.html"
                '''
            }
        }
    }

    post {
        always {
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
