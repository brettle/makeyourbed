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

  @dev
  Scenario:
    When I look at the Do list
    Then it is ordered by descending immediate value and then by descending delayed value
#    And each action has a green checkbox to its left

  @dev
  Scenario:
    When I look at the Don't list
    Then it is ordered by descending absolute immediate value and then by descending absolute delayed value
#    And each action has a red checkbox to its left

  @dev
  Scenario Outline:
    When I look at the <do_or_dont> list
    Then each action should have a short summary
    And each action should contain a progress detail indicating the value of reaching the target by a deadline

    Examples:
    | do_or_dont |
    | Do         |
    | Don't      |

  Scenario Outline:
    When I click the checkbox for "<action>", which does not affect my score
    Then the checkbox is <checked_or_xed>
    And the progress detail says "<progress_message>"
    And the checkbox is cleared within 1 second

    Examples:
    | action                | checked_or_xed | progress_message                                      |
    | Drink a cup of coffee | checked        | +1 microlife for drinking 3 more cups of coffee today |
    | Smoke a cigarette     | xed            | -1 microlife for smoking 1 more cigarette today       |

  Scenario Outline:
    When I click the checkbox for "<action>", which affects my score
    Then the checkbox is <checked_or_xed>
    And my score is changed by <score_change>
    And the action is removed from the list within 1 second

    Examples:
    | action                | checked_or_xed | score_change |
    | Have a healthy weight | checked        | +1           |
    | Be overweight         | xed            | -0.5         |
