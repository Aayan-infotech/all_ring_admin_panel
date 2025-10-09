pipeline {
  agent any

  environment {
    IMAGE_NAME = "bir_admin_panel"
    CONTAINER_NAME = "bir_admin_panel"
    HOST_PORT = "2005"
    CONTAINER_PORT = "2005"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        script {
          COMMIT = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
          env.IMAGE_TAG = "${IMAGE_NAME}:${COMMIT}"
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        sh "docker build -t ${IMAGE_TAG} ."
        sh "docker tag ${IMAGE_TAG} ${IMAGE_NAME}:latest || true"
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          set -e
          docker stop ${CONTAINER_NAME} || true
          docker rm ${CONTAINER_NAME} || true
          docker run -d \
            --name ${CONTAINER_NAME} \
            --restart unless-stopped \
            -p ${HOST_PORT}:${CONTAINER_PORT} \
            ${IMAGE_TAG}
        '''
      }
    }

    stage('Cleanup') {
      steps {
        sh "docker image prune -f || true"
      }
    }
  }

  post {
    success {
      echo "✅ Admin deployed: ${CONTAINER_NAME} -> http://91.189.120.112:${HOST_PORT}"
    }
    failure {
      echo "❌ Admin deploy failed. Check console logs."
    }
  }
}
