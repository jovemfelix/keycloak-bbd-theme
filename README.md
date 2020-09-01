# BBD Keycloak Themes
BBD's custom theme to override the default look and feel of Keycloak

## Theme Deployment
Themes can be deployed to Keycloak by copying the theme directory to `themes` or it can be deployed as an archive. During development copying the theme to the themes directory, but in production you may want to consider using an archive. An archive makes it simpler to have a versioned copy of the theme, especially when you have multiple instances of Keycloak for example with clustering.

To deploy the archive to Keycloak simply drop it into the `standalone/deployments/` directory of Keycloak and it will be automatically loaded.



## File theme.properties 

```properties
# Comma-separated list of supported locales
locales=en,pt-BR

# Parent theme to extend
parent=keycloak

# Import resources from another theme
import=common/rh-sso

# Space-separated list of styles to include
# To override styles from the parent stylesheets it’s important that your stylesheet is listed last.
styles=node_modules/rcue/dist/css/rcue.min.css node_modules/rcue/dist/css/rcue-additions.min.css css/account.css
```



## Theme Archive
To deploy a theme as an archive you need to create a JAR archive with the theme resources. You also need to add a file `META-INF/keycloak-themes.json` to the archive that lists the available themes in the archive as well as what types each theme provides.

For example for the `mytheme` theme create `mytheme.jar` with the contents:
- META-INF/keycloak-themes.json
- theme/mytheme/login/theme.properties
- theme/mytheme/login/login.ftl
- theme/mytheme/login/resources/css/styles.css
- theme/mytheme/login/resources/img/image.png
- theme/mytheme/login/messages/messages_en.properties
- theme/mytheme/email/messages/messages_en.properties

The contents of META-INF/keycloak-themes.json in this case would be:
```json
{
    "themes": [{
        "name" : "mytheme",
        "types": [ "login", "email" ]
    }]
}
```
A single archive can contain multiple themes and each theme can support one or more types.



# Openshift

```bash
# fazer login
# oc login
export PROJECT_NS=demo

oc project ${PROJECT_NS}

# the main point for getting the theme jar deployed you need to change TARGET DEPLOYMENT DIR (to use eap!)
## I thinks this is bug because if not set it uses /deployment dir
oc new-build -i sso74-openshift-rhel8:7.4 --binary  \
	--name=rhsso -lapp=rhsso \
	-e S2I_TARGET_DEPLOYMENTS_DIR=/opt/eap/standalone/deployments/

oc -n $PROJECT_NS start-build bc/rhsso --from-dir=target/ -w -F
```

### At build logs you should see this at line 20 and 21

```bash
Receiving source from STDIN as archive ...
Caching blobs under "/var/cache/blobs".
Getting image source signatures
Copying blob sha256:f20f68829d13b810c9b33f4ebd3942121ebea3ae97b34c9e1a11a835f27812b4
Copying blob sha256:bf00a0db0f25c37a702d013be76a1b211547ba5cb0cb72c2ab777bf603272bd5
Copying blob sha256:41ae95b593e0eabd584b11216673daee2d1d5e28e3dd8598beb763b76e24c35f
Copying config sha256:82c17faee0abf487648e41f93f379d3960359fea2f84d26b345fb9ba2fdb22cf
Writing manifest to image destination
...
STEP 1: FROM image-registry.openshift-image-registry.svc:5000/openshift/sso74-openshift-rhel8@sha256:cb17bbcc7d835f2699b17404cca233c1e9a8cf6828dcb147daf170b4db3c08f1
STEP 2: LABEL "io.openshift.build.image"="image-registry.openshift-image-registry.svc:5000/openshift/sso74-openshift-rhel8@sha256:cb17bbcc7d835f2699b17404cca233c1e9a8cf6828dcb147daf170b4db3c08f1"       "io.openshift.build.source-location"="/tmp/build/inputs"
STEP 3: ENV OPENSHIFT_BUILD_NAME="rhsso-autentica-1"     OPENSHIFT_BUILD_NAMESPACE="rhsso-autentica-dsv"     S2I_TARGET_DEPLOYMENTS_DIR="/opt/eap/standalone/deployments/"
STEP 4: USER root
STEP 5: COPY upload/src /tmp/src
STEP 6: RUN chown -R 185:0 /tmp/src
STEP 7: USER 185
STEP 8: RUN /usr/local/s2i/assemble
INFO S2I source build with plain binaries detected

INFO Copying deployments from . to /opt/eap/standalone/deployments/...
'/tmp/src/./bbd-themes-0.1.0-SNAPSHOT.jar' -> '/opt/eap/standalone/deployments/bbd-themes-0.1.0-SNAPSHOT.jar'
...
```

### At Deploy you should see this at line 19:

```
[0;33mWARN Ping protocol openshift.DNS_PING is deprecated, replacing with dns.DNS_PING instead.[0m
INFO Configuring JGroups discovery protocol to dns.DNS_PING
...
=========================================================================

  JBoss Bootstrap Environment

  JBOSS_HOME: /opt/eap

  JAVA: /usr/lib/jvm/java-11/bin/java

....

=========================================================================
...

[0m[0m17:31:33,986 INFO  [org.jboss.as.server.deployment] (MSC service thread 1-2) WFLYSRV0027: Starting deployment of "keycloak-server.war" (runtime-name: "keycloak-server.war")

[0m[0m17:31:33,998 INFO  [org.jboss.as.server.deployment] (MSC service thread 1-2) WFLYSRV0027: Starting deployment of "bbd-themes-0.1.0-SNAPSHOT.jar" (runtime-name: "bbd-themes-0.1.0-SNAPSHOT.jar")
```



## References

- [Keycloak Theme Deployment](https://www.keycloak.org/docs/latest/server_development/index.html#deploying-themes)
- Theme - https://access.redhat.com/documentation/en-us/red_hat_single_sign-on/7.4/html/server_developer_guide/themes
- How to import a custom theme into my RH-SSO container on Red Hat OpenShift - https://access.redhat.com/solutions/3094731
- To Get Openshift Templates - https://github.com/jboss-container-images/redhat-sso-7-openshift-image/tree/sso74-dev/docs
  - To import to Openshift - https://access.redhat.com/documentation/en-us/red_hat_single_sign-on/7.4/html-single/red_hat_single_sign-on_for_openshift_on_openjdk/index#image-streams-applications-templates
