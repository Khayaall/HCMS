pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "front-hcms"
        DOCKER_IMAGE2 = "back-hcms"
        // DOCKER_CONTAINER_NAME = "node-app-container"
        GIT_REPO = "https://github.com/Khayaall/HCMS"
        // file_path = "/home/zoz/devops/trials/"
        // file_path = "/home/zoz/Ubuntu/docker/docker_tut/practice4/"
    }
    stages {
        stage('Clone Repository') {
            steps {
                echo "Cloning repository..."
                sh '''
                rm -rf ./*         # Removes all files
                rm -rf .??*        # Removes hidden files like .git
                git clone -b main ${GIT_REPO} .
                '''
            }
        }

        stage('ENV Variables') {
            environment {
                API_URL = credentials('MY_ENV_IP')
            }
            steps{
                sh '''
                echo "VITE_API_URL=$API_URL" > .env
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh '''

                docker-compose down || true
                docker rmi ${DOCKER_IMAGE} || true
                docker rmi ${DOCKER_IMAGE2} || true
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
