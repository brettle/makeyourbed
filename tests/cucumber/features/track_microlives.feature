Feature: Track microlives

  As a normal user
  I want track the microlives I gain and lose as a result of my decisions
  So that I can live a longer, healthier, happier life.

  This is the primary feature of the application.

  Background:
    Given I am a new user
    And I navigate to "/"

  @dev
  Scenario:
    When I look at the page
    Then each action should have a short summary
    And each action should have a details link which displays the value of reaching the target by a deadline
    And the actions are listed in descending order by sign(immediate_value), abs(immediate_value), abs(delayed_value)

  Scenario Outline:
    When I click the checkbox for "<action>", which affects my score
    Then "<score_change>" floats to my score and modifies it
    And my score is changed by "<score_change>"

    Examples:
    | action                | score_change |
    | Have a healthy weight | +1           |
    | Be overweight         | -0.5         |
