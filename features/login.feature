Feature: Demoblaze login

  Background:
    Given I am on the home page

  @smoke @login
  Scenario: Logs in with valid credentials
    When I open the login form
    And I log in with valid credentials
    Then I see the welcome message for my user
    And I see the log out link

  @login @negative
  Scenario: Shows an error when the password is wrong
    When I open the login form
    And I log in with a wrong password
    Then I see the wrong password alert
    And I am not logged in
