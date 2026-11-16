Feature: The Podman plugin on a project row
  Once the plugin is activated and installed, every project folder that carries a compose file or a Containerfile carries
  the PODMAN menu, and the Plugins page lists the plugin with its four steps.

  # The Plugins page names each plugin; the package is on the plugin's own page (the row shows it on hover only).
  Scenario: The plugin is listed on the Plugins page, and its own page names its package
    Given I am on "/settings/plugins"
     Then I should see "Podman"
     When I go to "/settings/plugin/podman"
     Then I should see "@webship.co/workspace-podman"

  # The AI folders are searched by name: with every plugin on, a folder lists more than one page of items.
  Scenario: The AI Agents folder lists the agent the plugin ships
    Given I am on "/ai-agents?q=podman-operator"
     Then I should see "podman-operator"

  Scenario: The AI Skills folder lists the skill the plugin ships
    Given I am on "/ai-skills?q=podman-menu"
     Then I should see "podman-menu"

  Scenario: The AI Commands folder lists the command the plugin ships
    Given I am on "/ai-commands?q=podman-status"
     Then I should see "podman-status"

  Scenario: The AI Prompts folder lists the prompt the plugin ships
    Given I am on "/ai-prompts?q=podman-up-and-check"
     Then I should see "podman-up-and-check"
