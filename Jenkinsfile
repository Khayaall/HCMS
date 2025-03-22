pipeline {
    agent any

    environment {
        // DOCKER_IMAGE = "node-app"
        // DOCKER_CONTAINER_NAME = "node-app-container"
        GIT_REPO = "https://github.com/Khayaall/HCMS"
        // file_path = "/home/zoz/devops/trials/"
        file_path = "/home/zoz/Ubuntu/docker/docker_tut/practice4/"
    }
    stages {
        stage('Clone Repository') {
            steps {
                echo "Cloning repository..."
                sh '''
                    cd ${file_path}
                    rm -rf *
                    git clone -b main ${GIT_REPO} .
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh '''
                    docker-compose build --no-cache
                '''
            }
        }

        // stage('Run Unit Tests') {
        //     steps {
        //         script {
        //             sh "docker run --rm ${DOCKER_IMAGE}:latest npm test"  // Modify as per your project
        //         }
        //     }
        // }

        stage('Deploy Application') {
            steps {
                echo "Deploying application..."
                sh '''
                docker-compose down || true
                docker-compose up -d
                '''
            }
        }

        // stage('Clean Up') {
        //     steps {
        //         script {
        //             sh "docker system prune -f"
        //         }
        //     }
        // }
    }
    
    post {
        success {
            echo "Deployment successful!"
        }
        failure {
            echo "Deployment failed!"
        }
    }
}
