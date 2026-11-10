Feature: Demoblaze homepage

  Background:
    Given I am on the home page

  Scenario: Displays the core homepage elements
    Then the page title is correct
    And the navigation bar is displayed
    And the carousel is displayed
    And the categories heading and links are displayed
    And the product grid and pagination are displayed
    And the footer is displayed

  Scenario Outline: Filters the products when a category is selected
    When I select the "<category>" category
    Then only the "<category>" products are listed

    Examples:
      | category |
      | Phones   |
      | Laptops  |
      | Monitors |
