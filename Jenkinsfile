#!/usr/bin/env groovy

node {
    String PROJECT_NAME = 'Keycloak Theme'
    String BRANCH_NAME = "${env.BRANCH_NAME}"
    String BRANCH_TYPE = get_branch_type(BRANCH_NAME)
    String BRANCH_SERVER_ENV = get_branch_server_env(BRANCH_TYPE)
    String NOTIFICATION_EMAIL = 'kevin.bolduc@bbd.ca'

    stage('Checkout') {
        checkout scm
    }

    stage('Build') {
        def handleBuildFailures = {
            step('Send notification') {
                mail(to: NOTIFICATION_EMAIL,
                    subject: "${PROJECT_NAME} Build stage failed for branch: ${BRANCH_NAME}",
                    body: "${PROJECT_NAME} Build stage failed for branch: ${BRANCH_NAME} \n\n(<$BUILD_URL/console|Job>)");
            }
            // slackSend channel: 'instant_notifications', color: 'warning', message: "${PROJECT_NAME} Build stage failed for branch: ${BRANCH_NAME} \n\nLast commiters are: \n" + commitList().toString() + " \n\n(<$BUILD_URL/console|Job>)"
        }


        try {
            // Note: User "clean package", instead of "clean install", due to one
            // global maven repository being configured in Jenkins, related to docker-in-docker.

            sh "./mvnw clean package"

            // withMaven(jdk: 'JDK 8 update 191', maven: 'Maven 3.5.4') {
            //     sh "mvn clean package"
            // }

            // archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
        } catch (Exception e) {
            handleBuildFailures()
            throw e
        }
    }

    stage('Deploy') {
        //TODO: Remove this if statement once all other dev envs have been setup!
        if (BRANCH_TYPE == 'develop') {
            deployToServer(BRANCH_SERVER_ENV)
        }
    }
}

// Utility functions
def deployToServer(String serverEnv) {
    // TODO: /home/jenkins-deployer can be default remote dir in the sshPublisher config in Jenkins
    String HOST_REMOTE_DIR_BASE = "/home/jenkins-deployer/keycloak_themes_${serverEnv}";

    sshPublisher(publishers: [sshPublisherDesc(
      configName: get_ssh_publisher_name_by_server_env(serverEnv),
      transfers: [sshTransfer(
        excludes: '',
        execCommand: "sudo mv ${HOST_REMOTE_DIR_BASE}/bbd-themes*.jar /opt/keycloak/${serverEnv}/keycloak/standalone/deployments/bbd-themes.jar",
        execTimeout: 120000,
        usePty: true,
        flatten: false,
        makeEmptyDirs: false,
        cleanRemote: true,
        noDefaultExcludes: false,
        patternSeparator: '[, ]+',
        remoteDirectory: "${HOST_REMOTE_DIR_BASE}",
        remoteDirectorySDF: false,
        removePrefix: 'target',
        sourceFiles: 'target/*.jar'
      )],
      usePromotionTimestamp: false,
      useWorkspaceInPromotion: true,
      verbose: false)]
    );
}

def get_branch_type(String branchNameFromEnv) {
    //Must be specified according to <flowInitContext> configuration of jgitflow-maven-plugin in pom.xml
    if (branchNameFromEnv == 'develop') {
        return 'develop'
    } else if (branchNameFromEnv == 'master') {
        return 'master'
    } else if (branchNameFromEnv.startsWith('release-')) {
        return 'release'
    } else if (branchNameFromEnv.startsWith('feature-')) {
        return 'feature'
    } else if (branchNameFromEnv.startsWith('hotfix-')) {
        return 'hotfix'
    } else {
        return null;
    }
}

def get_branch_server_env(String branchTypeFromUtil) {
    if (branchTypeFromUtil == 'develop') {
        return 'alpha'
    } else if (branchTypeFromUtil == 'release') {
        return 'rc'
    } else if (branchTypeFromUtil == 'hotfix') {
        return 'critical'
    } else if (branchTypeFromUtil == 'master') {
        return 'production'
    } else {
        return null;
    }
}

def get_ssh_publisher_name_by_server_env(String serverEnv) {
    if (serverEnv == 'alpha') {
        return 'opalpha'
    } else if (serverEnv == 'beta') {
        return 'opbeta'
    } else if (serverEnv == 'rc') {
        return 'oprc'
    } else if (serverEnv == 'critical') {
        return 'opcritical'
    } else if (serverEnv == 'production') {
        return 'serac'
    } else {
        return null;
    }
}
