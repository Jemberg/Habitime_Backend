pipeline {

    agent {
        label 'pineapple'
    }

    stages {
        stage('Build Project') { 
            steps {
                sh 'node --version'
                sh 'npm build' 
            }
        }

        stage("NPM Test") {
            steps {
                sh "npm test"
            }
        }
    }
}