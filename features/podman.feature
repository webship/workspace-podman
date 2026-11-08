Feature: The Podman plugin on a project row
  Once the plugin is activated and installed, every project folder that carries a compose file or a Containerfile carries
  the PODMAN menu, and the Plugins page lists the plugin with its four steps.

  Scenario: The plugin is listed on the Plugins page
    Given I am on "/settings/plugins"
     Then I should see "Podman"
      And I should see "@webship.co/workspace-podman"
