// TODO повыносить все в env

void setBuildStatus(String message, String state) {
  step([
      $class: "GitHubCommitStatusSetter",
      reposSource: [$class: "ManuallyEnteredRepositorySource", url: "https://github.com/uniteam31/jenkins-test.git"], // !!! editable
      contextSource: [$class: "ManuallyEnteredCommitContextSource", context: "ci/jenkins/build-status"],
      errorHandlers: [[$class: "ChangingBuildStatusErrorHandler", result: "UNSTABLE"]],
      statusResultSource: [ $class: "ConditionalStatusResultSource", results: [[$class: "AnyBuildResult", message: message, state: state]] ]
  ]);
}

pipeline {
    agent any

    environment {
        NODEJS_HOME = "${tool 'node21'}"
        PATH = "${env.NODEJS_HOME}/bin:${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    setBuildStatus("Checkout started", "PENDING");
                }
                git branch: "${env.BRANCH_NAME ?: 'dev'}", url: 'https://github.com/uniteam31/jenkins-test.git'
            }
        }

        stage('Run Tests and Linters') {
            steps {
                script {
                    setBuildStatus("Running tests and linters", "PENDING");
                }

                echo "Current branch: ${env.BRANCH_NAME}"

                // Добавьте здесь команды для тестов и линтеров
//                 sh 'npm install && npm run lint && npm test'
            }
        }

        stage('Build Docker Image') {
//             when {
//                 branch 'dev'
//             }
            steps {
                script {
                    setBuildStatus("Building Docker image", "PENDING");
                    app = docker.build("def1s/jenkins-test")
                }
            }
        }

        stage('Push Docker Image') {
           when {
               branch 'dev'
           }
            steps {
                script {
                    setBuildStatus("Pushing Docker image", "PENDING");
                    docker.withRegistry('https://registry.hub.docker.com', 'def1s') {
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
                sshagent(['dev_ssh']) {
                    sh 'ssh root@176.114.90.241 "docker pull def1s/jenkins-test"'
                    sh 'ssh root@176.114.90.241 "if docker ps -a --format \\"{{.Names}}\\" | grep -q \\"jenkins-test\\"; then docker stop jenkins-test || true; docker rm jenkins-test || true; fi"'
                    sh 'ssh root@176.114.90.241 "docker run -dp 3001:3001 --name jenkins-test def1s/jenkins-test"'
                }
            }
        }
    }

    post {
        success {
            setBuildStatus("Build succeeded", "SUCCESS");
            echo 'Pipeline выполнен успешно.'
        }
        failure {
            setBuildStatus("Build failed", "FAILURE");
            echo 'Pipeline завершился с ошибкой.'
        }
        always {
            cleanWs()
        }
    }
}

