Feature: Track microlives

  As a normal user
  I want track the microlives I gain and lose as a result of my decisions
  So that I can live a longer, healthier, happier life.

  This is the primary feature of the application.

  Background:
    Given I am a new user
    And I navigate to "/"

  Scenario Outline:
    When I see the microlives table
    Then column <column> should be labeled "<label>"

    Examples:
    | column | label      |
    |      1 | Lifestyle  |
    |      2 | Microlives |
    |      3 | Choices    |

  Scenario Outline:
    When I look at "<lifestyle>"
    Then the Microlives column should say "<microlives>"

    Examples:
    | lifestyle                                  | microlives |
    | Drink 3-5 cups of coffee today             |        0.5 |
    | Exercise for 60 minutes over the next week |          1 |
