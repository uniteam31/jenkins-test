// TODO повыносить все в env
pipeline {
    agent any

    environment {
        NODEJS_HOME = "${tool 'node21'}"
        PATH = "${env.NODEJS_HOME}/bin:${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: "${env.BRANCH_NAME ?: 'dev'}", url: 'https://github.com/uniteam31/jenkins-test.git'
            }
        }

        stage('Run Tests and Linters') {
            steps {
                echo "Current branch: ${env.BRANCH_NAME}"

                // Добавьте здесь команды для тестов и линтеров
                // sh 'npm install && npm run lint && npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def branchName = env.CHANGE_BRANCH ?: env.BRANCH_NAME
                    echo "Building branch: ${branchName}"

                    app = docker.build("def1s/jenkins-test", "--no-cache --build-arg BRANCH=${branchName} .") // TODO можно проюзать только к clone
                }
            }
        }

        stage('Push Docker Image') {
           when {
               branch 'dev'
           }
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-def1s') {
                        app.push("${env.BUILD_NUMBER}")
                        app.push("latest")
                    }
                }
            }
        }

        stage('Deploy to Dev Server') {
            when {
                branch 'dev'
            }
            steps {
                sshagent(['jenkins-test_ssh']) {
                    sh 'ssh root@176.114.90.241 "docker pull def1s/jenkins-test"'
                    sh 'ssh root@176.114.90.241 "if docker ps -a --format \\"{{.Names}}\\" | grep -q \\"jenkins-test\\"; then docker stop jenkins-test || true; docker rm jenkins-test || true; fi"'
                    sh 'ssh root@176.114.90.241 "docker run -dp 3000:80 --name jenkins-test def1s/jenkins-test"'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline выполнен успешно.'
        }
        failure {
            echo 'Pipeline завершился с ошибкой.'
        }
        always {
            cleanWs()
        }
    }
}

