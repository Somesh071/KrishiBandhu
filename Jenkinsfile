@Library('Shared') _

pipeline {
    agent any

    environment {
        // Docker Images
        BACKEND_IMAGE = 'adarsh5559/krishibandhu-backend'
        FRONTEND_IMAGE = 'adarsh5559/krishibandhu-frontend'
        IMAGE_TAG = "${BUILD_NUMBER}"

        // Application Git
        GIT_REPO = "https://github.com/Adarsh097/KrishiBandhu.git"
        GIT_BRANCH = "main"
    }

    stages {

        // ----------------------------
        //  Cleanup Workspace
        // ----------------------------
        stage('Cleanup Workspace') {
            steps {
                script {
                    clean_ws()
                }
            }
        }

        // ----------------------------
        //  Clone Application Repository
        // ----------------------------
        stage('Clone Repository') {
            steps {
                script {
                    clone(env.GIT_REPO, env.GIT_BRANCH)
                }
            }
        }

        // ----------------------------
        //  Build Docker Images (Parallel)
        // ----------------------------
        stage('Build Docker Images') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        script {
                            docker_build(
                                imageName: env.BACKEND_IMAGE,
                                imageTag: env.IMAGE_TAG,
                                dockerfile: 'backend/Dockerfile',
                                context: './backend'
                            )
                        }
                    }
                }

                stage('Build Frontend Image') {
                    steps {
                        script {
                            docker_build(
                                imageName: env.FRONTEND_IMAGE,
                                imageTag: env.IMAGE_TAG,
                                dockerfile: 'frontend/Dockerfile',
                                context: './frontend'
                            )
                        }
                    }
                }
            }
        }

        // ----------------------------
        //  Run Unit Tests
        // ----------------------------
        stage('Run Unit Tests') {
            steps {
                script {
                    run_tests()
                }
            }
        }

        // ----------------------------
        //  Security Scan with Trivy
        // ----------------------------
        stage('Security Scan') {
            steps {
                script {
                    trivy_scan()
                }
            }
        }

        // ----------------------------
        //  Push Docker Images (Parallel)
        // ----------------------------
        stage('Push Docker Images') {
            parallel {
                stage('Push Backend Image') {
                    steps {
                        script {
                            docker_push(
                                imageName: env.BACKEND_IMAGE,
                                imageTag: env.IMAGE_TAG,
                                credentials: 'docker-hub-credentials'
                            )
                        }
                    }
                }

                stage('Push Frontend Image') {
                    steps {
                        script {
                            docker_push(
                                imageName: env.FRONTEND_IMAGE,
                                imageTag: env.IMAGE_TAG,
                                credentials: 'docker-hub-credentials'
                            )
                        }
                    }
                }
            }
        }

        // ----------------------------
        //  GitOps Update - Kubernetes Manifests
        // ----------------------------
        stage('Update Kubernetes Manifests') {
            steps {
                script {
                    // Clone private deployment repo
                    dir('deployment-repo') {
                        git(
                            url: 'https://github.com/Adarsh097/KrishiBandhu-Deployment.git',
                            branch: 'main',
                            credentialsId: 'github-credentials'
                        )

                        // Call shared library to update manifests
                        update_k8s_manifests(
                            imageTag: env.IMAGE_TAG,
                            manifestsPath: 'kubernetes',
                            gitCredentials: 'github-credentials',
                            gitUserName: 'Adarsh097',
                            gitUserEmail: 'adarshgupta0601@gmail.com'
                        )
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                echo "Cleaning workspace after build..."
                clean_ws()
            }
        }
        success {
            echo "Pipeline completed successfully! Docker images and Kubernetes manifests updated."
        }
        failure {
            echo "Pipeline failed! Check logs for errors."
        }
    }
}