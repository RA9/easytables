Certainly, here is the documentation provided as a Markdown (.md) file:

````markdown
# EasyTables Documentation

## Table of Contents

1. **Introduction**

   - What is EasyTables?
   - Why Use EasyTables?

2. **Getting Started**

   - Installation
   - Usage

3. **API Reference**

   - Constructor
   - Filtering Data
   - Pagination
   - Custom Rendering
   - Information on Displayed Items

4. **How EasyTables Differs**
   - Comparison with DataTables
   - Lightweight and Minimalistic

## 1. Introduction

### What is EasyTables?

**EasyTables** is a minimalistic JavaScript library for creating reactive data tables with built-in sorting, searching,
and pagination capabilities. It provides a straightforward and customizable way to manage and display tabular data
without requiring complex dependencies or extensive HTML wrappers.

### Why Use EasyTables?

- **Minimalistic**: EasyTables is designed to be lightweight, making it an excellent choice for projects where you want
  to keep your dependencies minimal.

- **Reactive Data**: It uses a Proxy to make data reactive. Any changes to your data source trigger automatic updates,
  enabling real-time changes in your table.

- **Customizable Rendering**: EasyTables allows you to define your own rendering logic, giving you full control over the
  visual presentation of your data.

- **Server-Side or Local Data**: You can use EasyTables with both server-side and local data sources, making it
  versatile and adaptable to different use cases.

## 2. Getting Started

### Installation

To get started with EasyTables, you need to include the library in your project. You can either download the JavaScript
file or use a package manager like npm or yarn:

```html
<script src="path/to/easytables.js"></script>
```
````

```bash
npm install easytables
```

### Usage

Here's a basic example of how to create a data table with EasyTables:

```html
<!doctype html>
<html>
  <head>
    <title>EasyTables Example</title>
  </head>
  <body>
    <table id="myTable">
      <thead>
        <tr>
          <th>Item</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <p id="paginationInfo"></p>

    <script>
      const data = [
        "Item 1",
        "Item 2",
        "Item 3",
        "Another Item",
        "Yet Another Item",
        "New Item 1",
        "New Item 2",
        "New Item 3",
        "Even More Items",
        "Last Item",
      ];

      const customRender = data => {
        // Replace this with your custom rendering logic
        const tableBody = document.querySelector("#myTable tbody");
        tableBody.innerHTML = "";
        data.forEach(item => {
          const row = document.createElement("tr");
          row.innerHTML = `<td>${item}</td>`;
          tableBody.appendChild(row);
        });
        const pageInfo = document.querySelector("#paginationInfo");
        pageInfo.textContent = `Page ${easyTable.getCurrentPage()} of ${easyTable.getTotalPages()}`;
      };

      const easyTable = new EasyTables({
        data,
        perPage: 3,
        renderFunction: customRender,
      });

      easyTable.setSearch("Item");
    </script>
  </body>
</html>
```

This simple example demonstrates how to create a table and bind it to EasyTables, apply search functionality, and
customize the rendering logic.

## 3. API Reference

EasyTables provides the following methods:

- `constructor(opts: EasyTablesOptions)`: Initializes the EasyTables instance.
- `setSearch(query: string)`: Sets the search query and updates the table.
- `nextPage()`: Moves to the next page and updates the table.
- `prevPage()`: Moves to the previous page and updates the table.
- `getCurrentPage()`: Returns the current page number.
- `getTotalPages()`: Returns the total number of pages.
- `getShowingInfo()`: Returns information about the displayed items on the current page.

## 4. How EasyTables Differs

### Comparison with DataTables

EasyTables aims to be a lightweight alternative to DataTables, a popular library for creating interactive data tables.
While DataTables offers extensive features and customization, it often comes with a larger file size and dependencies.
In contrast, EasyTables focuses on simplicity and minimalism.

### Lightweight and Minimalistic

EasyTables is built with simplicity in mind. It doesn't come with extensive features or external dependencies, making it
a great choice for projects where you want a straightforward data table solution. It's well-suited for developers who
prefer a more hands-on approach to table rendering and customization.

## 5. Problem EasyTables Solves

**EasyTables** addresses several common problems in working with data tables:

- **Reactivity**: EasyTables offers reactive data handling, ensuring that any changes to the underlying data source are
  automatically reflected in the displayed table, without the need for manual updates.

- **Simplicity**: It simplifies the process of creating data tables, especially when you don't require an extensive
  feature set, complex configurations, or heavy dependencies.

- **Customization**: EasyTables allows developers to define their own rendering logic, giving them full control over the
  presentation of their data.

- **Versatility**: It can be used with both server-side and local data sources, making it a versatile option for various
  projects.

# Conclusion

**EasyTables** is a minimalist

data table library designed for simplicity, reactivity, and customization. It offers a lightweight and straightforward
way to create reactive data tables without the need for extensive dependencies or complex configurations. If you're
looking for a minimalistic solution to display and manage tabular data, EasyTables might be the right choice for your
project.

For more detailed information and advanced use cases, please refer to the official EasyTables documentation or explore
the library's source code.

_Note: This documentation provides a simplified overview of EasyTables. Actual documentation for a library should
include more detailed usage examples, edge cases, and further explanations of available features._

Feel free to adapt and extend this simplified documentation according to your project's specific requirements.

```

You can save the above content as a `.md` file, and it should render correctly when viewed in Markdown-supported editors or platforms.
```
