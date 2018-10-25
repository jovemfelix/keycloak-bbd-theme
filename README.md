# BBD Keycloak Themes
BBD's custom theme to override the default look and feel of Keycloak

## Theme Deployment
Themes can be deployed to Keycloak by copying the theme directory to `themes` or it can be deployed as an archive. During development copying the theme to the themes directory, but in production you may want to consider using an archive. An archive makes it simpler to have a versioned copy of the theme, especially when you have multiple instances of Keycloak for example with clustering.

To deploy the archive to Keycloak simply drop it into the `standalone/deployments/` directory of Keycloak and it will be automatically loaded.

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
```
{
    "themes": [{
        "name" : "mytheme",
        "types": [ "login", "email" ]
    }]
}
```
A single archive can contain multiple themes and each theme can support one or more types.


## Documentation References
- [Keycloak Theme Deployment](https://www.keycloak.org/docs/latest/server_development/index.html#deploying-themes)
