void setBuildStatus(String message, String state) {
  step([
      $class: "GitHubCommitStatusSetter",
      reposSource: [$class: "ManuallyEnteredRepositorySource", url: "https://github.com/uniteam31/jenkins-test.git"],
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
                setBuildStatus("Build succeeded", "PENDING");
                git branch: 'dev', url: 'https://github.com/uniteam31/jenkins-test.git'
            }
        }

        // TODO прогнать тесты и линтеры

        stage('Build Docker Image') {
//             when {
//                 branch 'main'  // Execute this stage only for the main branch
//             }

            steps {
                script {
                    // Build the Docker image
                    app = docker.build("def1s/jenkins-test")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Push the Docker image to Docker Hub
                    docker.withRegistry('https://registry.hub.docker.com', 'def1s') {
                        app.push("${env.BUILD_NUMBER}")
                        app.push("latest")
                    }
                }
            }
        }

        stage('Deploy to dev server from Docker registry') {
            steps {
                sshagent(['dev_ssh']) {
                    sh 'ssh root@176.114.90.241 "echo Successfully connected!"'
                    sh 'ssh root@176.114.90.241 "docker pull def1s/jenkins-test"'
                    // Удаляет процессы только при их наличии
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
            cleanWs() // Удаляет временные файлы рабочего пространства
        }
    }
}
