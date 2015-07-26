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
    Then I see a Do list
    And I see a Don't list
    And each action should have a short summary
    And each action should have a details link which displays the value of reaching the target by a deadline

  @dev
  Scenario:
    When I look at the Do list
    Then it is ordered by descending immediate value and then by descending delayed value

  @dev
  Scenario:
    When I look at the Don't list
    Then it is ordered by descending absolute immediate value and then by descending absolute delayed value

  Scenario Outline:
    When I click the checkbox for "<action>", which affects my score
    Then "<score_change>" floats to my score and modifies it
    And my score is changed by "<score_change>"

    Examples:
    | action                | score_change |
    | Have a healthy weight | +1           |
    | Be overweight         | -0.5         |
