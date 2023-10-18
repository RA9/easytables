# EzyTables Documentation

## Table of Contents

1. **Introduction**

   - What is EzyTables?
   - Why Use EzyTables?

2. **Getting Started**

   - Installation
   - Usage

3. **API Reference**

   - Constructor
   - Filtering Data
   - Pagination
   - Custom Rendering
   - Information on Displayed Items

4. **How EzyTables Differs**
   - Comparison with DataTables
   - Lightweight and Minimalistic

## 1. Introduction

### What is EzyTables?

**EzyTables** is a minimalistic JavaScript library for creating reactive data tables with built-in sorting, searching,
and pagination capabilities. It provides a straightforward and customizable way to manage and display tabular data
without requiring complex dependencies or extensive HTML wrappers.

### Why Use EzyTables?

- **Minimalistic**: EzyTables is designed to be lightweight, making it an excellent choice for projects where you want
  to keep your dependencies minimal.

- **Reactive Data**: It uses a Proxy to make data reactive. Any changes to your data source trigger automatic updates,
  enabling real-time changes in your table.

- **Customizable Rendering**: EzyTables allows you to define your own rendering logic, giving you full control over the
  visual presentation of your data.

- **Server-Side or Local Data**: You can use EzyTables with both server-side and local data sources, making it
  versatile and adaptable to different use cases.

## 2. Getting Started

### Installation

To get started with EzyTables, you need to include the library in your project. You can either download the JavaScript
file or use a package manager like npm or yarn:

```html
<script type="module" src="https://esm.sh/ezytables"></script>
```

```bash
npm install ezytables
```

### Usage

Here's a basic example of how to create a data table with EzyTables:

```html
<!doctype html>
<html>
  <head>
    <title>EzyTables Example</title>
  </head>
  <body>
    <div class="table-controls">
      <label for="limitSelect">Show</label>
      <select id="limitSelect">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
      <label for="searchInput">Search</label>
      <input id="searchInput" placeholder="Search..." />
    </div>
    <table id="myTable">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <div class="pagination">
      <button id="prevButton">Prev</button>
      <button id="nextButton">Next</button>
    </div>
    <p id="paginationInfo"></p>

    <script type="module">
      import { EzyTables } from "https://esm.sh/ezytables";
      
      const data = [
        {
          name: "John Brown",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nunc eu nisi. Sed vitae nisl eget nisl aliquam aliquet. Sed vitae nisl eget nisl aliquam aliquet.",
          status: "Active",
          date: "2020-01-01",
        },
        {
          name: "Jane Abram",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nunc eu nisi. Sed vitae nisl eget nisl aliquam aliquet. Sed vitae nisl eget nisl aliquam aliquet.",
          status: "Active",
          date: "2020-01-01",
        },
        {
          name: "Sam Smith",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nunc eu nisi. Sed vitae nisl eget nisl aliquam aliquet. Sed vitae nisl eget nisl aliquam aliquet.",
          status: "Active",
          date: "2020-01-01",
        },
        {
          name: "Ekaterina Tankova",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nunc eu nisi. Sed vitae nisl eget nisl aliquam aliquet. Sed vitae nisl eget nisl aliquam aliquet.",
          status: "Active",
          date: "2020-01-01",
        },
        {
          name: "Luisa Hanes",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, vitae aliquam nisl nunc eu nisi. Sed vitae nisl eget nisl aliquam aliquet. Sed vitae nisl eget nisl aliquam aliquet.",
          status: "Active",
          date: "2020-01-01",
        },
      ];

      const customRender = data => {
        // Replace this with your custom rendering logic
        const tableBody = document.querySelector("#myTable tbody");
        tableBody.innerHTML = "";
        data.forEach(item => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>${item.status}</td>
            <td>${item.date}</td>
          `;
          tableBody.appendChild(row);
        });

        // Display pagination info
        const pageInfo = document.querySelector("#paginationInfo");
        pageInfo.textContent = `${easyTable.getShowingInfo()}`;
      };

      const easyTable = new EzyTables({
        data,
        perPage: 3,
        renderFunction: customRender,
        clientEnabled: true,
        client: {
          perPage: 3,
        },
      });

      const searchInput = document.querySelector("#searchInput");
      searchInput.addEventListener("input", () => {
        easyTable.setSearchDebounced(searchInput.value);
      });

      const prevButton = document.querySelector("#prevButton");
      prevButton.addEventListener("click", () => {
        easyTable.prevPage();
      });

      const nextButton = document.querySelector("#nextButton");
      nextButton.addEventListener("click", () => {
        easyTable.nextPage();
      });
    </script>
  </body>
</html>
```

This simple example demonstrates how to create a table and bind it to EzyTables, apply search functionality, and customize the rendering logic.

## 3. API Reference

EzyTables provides the following methods:

- `constructor(opts: EzyTablesOptions)`: Initializes the EzyTables instance.
- `setSearchDebounced(query: string)`: Sets the search query and updates the table.
- `sortData(column: string, order: "asc" | "desc")`: Sorts the data by the specified column and order.
- `nextPage()`: Moves to the next page and updates the table.
- `prevPage()`: Moves to the previous page and updates the table.
- `getCurrentPage()`: Returns the current page number.
- `getTotalPages()`: Returns the total number of pages.
- `getShowingInfo()`: Returns information about the displayed items on the current page.

## 4. How EzyTables Differs

### Comparison with DataTables

EzyTables aims to be a lightweight alternative to DataTables, a popular library for creating interactive data tables.
While DataTables offers extensive features and customization, it often comes with a larger file size and dependencies.
In contrast, EzyTables focuses on simplicity and minimalism.

### Lightweight and Minimalistic

EzyTables is built with simplicity in mind. It doesn't come with extensive features or external dependencies, making it
a great choice for projects where you want a straightforward data table solution. It's well-suited for developers who
prefer a more hands-on approach to table rendering and customization.

## 5. Problem EzyTables Solves

**EzyTables** addresses several common problems in working with data tables:

- **Reactivity**: EzyTables offers reactive data handling, ensuring that any changes to the underlying data source are
  automatically reflected in the displayed table, without the need for manual updates.

- **Simplicity**: It simplifies the process of creating data tables, especially when you don't require an extensive
  feature set, complex configurations, or heavy dependencies.

- **Customization**: EzyTables allows developers to define their own rendering logic, giving them full control over the
  presentation of their data.

- **Versatility**: It can be used with both server-side and local data sources, making it a versatile option for various
  projects.

## Conclusion

**EzyTables** is a minimalist

data table library designed for simplicity, reactivity, and customization. It offers a lightweight and straightforward
way to create reactive data tables without the need for extensive dependencies or complex configurations. If you're
looking for a minimalistic solution to display and manage tabular data, EzyTables might be the right choice for your
project.

For more detailed information and advanced use cases, please refer to the official EzyTables documentation or explore
the library's source code.

## 5. Roadmap

Here are some of the features and improvements we're planning to add to EzyTables in the future:

- **Server-side rendering support**: To improve performance for large data sets.
- **Additional customization options**: To give developers even more control over the look and feel of their tables.
- **Improved accessibility**: To make EzyTables more user-friendly for people with disabilities.
- **Integration with popular frameworks**: To make it easier to use EzyTables in projects that use frameworks like React, Vue, and Angular.

Please note that this roadmap is subject to change based on user feedback and the needs of our community.

### About the Author

[Carlos S. Nah](http://github.com/ra9) is a software engineer and writer based in Monrovia. He is the author of EzyTables, a minimalist data table library for JavaScript. He enjoys writing about software development, web development, and technology.
