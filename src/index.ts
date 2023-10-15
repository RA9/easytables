interface EasyTablesOptions {
  clientEnabled?: boolean; // Enable or disable client-side data fetching (default: true)
  data?: string[]; // Data source (only for client-side)
  server?: {
    api_url: string; // API URL for server-side data fetching
    headers?: Record<string, string>; // Optional headers for server-side data fetching
    limit: number; // Items per page for server-side
    page: number; // Current page for server-side
    dataNames: string; // Comma-separated data names for server-side (e.g., "data1,data2,data3")
  };
  client?: {
    limit: number;
    perPage?: number; // Items per page for client-side (default: 10)
  };
  renderFunction?: (data: string[]) => void; // Custom rendering function
}

enum DataMode {
  Filtered = "filtered",
  Paginated = "paginated",
}

class EasyTables {
  private _data: any[] = [];
  private perPage: number;
  private currentPage: number;
  private searchQuery: string;
  private renderFunction?: (data: string[]) => void;
  private serverEnabled: boolean;
  private dataMode: string = DataMode.Paginated;
  private serverOptions: {
    api_url: string;
    headers?: Record<string, string>;
    limit: number;
    page: number;
    dataNames: string[];
  };

  private sortField: string | null = null;
  private sortOrder: "asc" | "desc" = "asc";

  // @ts-ignore
  private client: {
    limit: number;
    perPage?: number; // Items per page for client-side (default: 10)
  };

  constructor(opts: EasyTablesOptions) {
    this.serverEnabled = !opts.clientEnabled;
    if (opts.clientEnabled) {
      this._data = new Proxy(opts.data || [], {
        set: (target: any, key: string, value) => {
          target[key] = value;
          this.updateTable();
          return true;
        },
      });
    }

    this.client = {
      limit: opts.client?.limit || 10,
      perPage: opts.client?.perPage,
    };

    this.perPage = this.serverEnabled
      ? opts.server?.limit || 10
      : opts.client?.perPage
      ? opts.client.perPage
      : 10;
    this.currentPage = this.serverEnabled ? opts.server?.page || 1 : 1;
    this.searchQuery = "";
    this.renderFunction = opts.renderFunction;
    this.serverOptions = {
      api_url: opts.server?.api_url || "",
      headers: opts.server?.headers || {},
      limit: opts.server?.limit || 10,
      page: opts.server?.page || 1,
      dataNames: opts.server?.dataNames ? opts.server.dataNames.split(".") : [],
    };
    //    this.client = opts.client || {
    //      limit: 10,
    //    };

    if (this.renderFunction) {
      this.updateTable();
    }
  }

  // Private method to filter data based on search query
  private filterData(): string[] | object[] {
    if (this._data.length === 0) return this._data;

    if (Array.isArray(this._data[0]) && typeof this._data[0][0] === "string") {
      // 2-dimensional array of strings
      return this.searchInTwoDimensionalArray(this._data, this.searchQuery);
    } else if (typeof this._data[0] === "object") {
      // Array of objects
      return this.searchInArrayOfObjects(this._data, this.searchQuery);
    } else {
      console.error("Unsupported data structure for searching");
      return this._data;
    }
  }

  sortData(field: string, order: "asc" | "desc" = "asc"): void {
    this.sortField = field;
    this.sortOrder = order;
    this.updateTable();
  }

  // Get data based on the specified data mode (filtered or paginated)
  async getData(): Promise<string[]> {
    if (this.serverEnabled) {
      try {
        const response = await fetch(this.serverOptions.api_url, {
          method: "GET",
          headers: this.serverOptions.headers,
        });

        if (response.ok) {
          const rawData = await response.json();
          let actualData = rawData;

          if (
            this.serverOptions.dataNames &&
            this.serverOptions.dataNames.length > 0
          ) {
            const dataNames = this.serverOptions.dataNames;
            for (const name of dataNames) {
              if (actualData.hasOwnProperty(name)) {
                actualData = actualData[name];
              } else {
                console.error(
                  `Data property '${name}' not found in the server response.`
                );
                return [];
              }
            }
          }

          if (this.dataMode === DataMode.Paginated) {
            const startIndex = (this.currentPage - 1) * this.perPage;
            const endIndex = startIndex + this.perPage;

            this._data = actualData;

            return actualData.slice(startIndex, endIndex);
          }
        } else {
          console.error(
            "Error fetching data:",
            response.status,
            response.statusText
          );
          return [];
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        return [];
      }
    } else {
      let dataToUse = this._data;

      if (this.dataMode === DataMode.Filtered) {
        dataToUse = this.filterData() as any;
      }

      if (this.sortField) {
        dataToUse.sort((a: any, b: any) => {
          if (
            !a.hasOwnProperty(this.sortField) ||
            !b.hasOwnProperty(this.sortField)
          ) {
            return 0;
          }

          // @ts-ignore
          const varA =
            this.sortField && typeof a[this.sortField] === "string"
              ? a[this.sortField].toUpperCase()
              : a[this.sortField || ""];
          // @ts-ignore
          const varB =
            this.sortField && typeof b[this.sortField] === "string"
              ? b[this.sortField].toUpperCase()
              : b[this.sortField || ""];

          let comparison = 0;
          if (varA > varB) {
            comparison = 1;
          } else if (varA < varB) {
            comparison = -1;
          }
          return this.sortOrder === "desc" ? comparison * -1 : comparison;
        });
      }

      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      return dataToUse.slice(startIndex, endIndex) as any;
    }

    return [];
  }

  private debounce(func: Function, delay: number) {
    let timerId: ReturnType<typeof setTimeout>;

    return function (this: any, ...args: any[]) {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  setSearchDebounced = this.debounce(this.setSearch, 300);

  // Set the search query
  private setSearch(query: string): void {
    this.searchQuery = query;
    this.dataMode = DataMode.Filtered;

    if (query.length === 0) {
      this.dataMode = DataMode.Paginated;
    }

    this.currentPage = 1; // Reset to the first page when searching
    this.updateTable();
  }

  // Search in a 2-dimensional array of strings
  private searchInTwoDimensionalArray(
    data: string[][],
    query: string
  ): string[][] {
    return data.filter(row =>
      row.some(cell => cell.toLowerCase().includes(query.toLowerCase()))
    );
  }

  // Search in an array of objects
  private searchInArrayOfObjects(data: object[], query: string): object[] {
    return data.filter(item =>
      Object.values(item).some(
        value =>
          typeof value === "string" &&
          value.toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  // Pagination methods
  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updateTable(); // Trigger re-render on next page
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateTable(); // Trigger re-render on previous page
    }
  }

  getCurrentPage(): number {
    return this.currentPage;
  }

  getTotalPages(): number {
    if (this.dataMode === DataMode.Filtered) {
      return this.calculateTotalPages(this.filterData().length);
    }

    return this.calculateTotalPages(this._data.length);
  }

  private calculateTotalPages(totalItems: number): number {
    return Math.ceil(totalItems / this.perPage);
  }

  // Method to get information about the items being displayed
  getShowingInfo(): string {
    let totalItems;
    let startIndex;
    let endIndex;
    let filteredItems = "";

    if (this.dataMode === DataMode.Filtered) {
      const filteredData = this.filterData();
      totalItems = filteredData.length;
      startIndex = (this.currentPage - 1) * this.perPage + 1;
      endIndex = Math.min(startIndex + this.perPage - 1, totalItems);
      filteredItems = ` (filtered from ${this._data.length} total items)`;
    } else {
      totalItems = this.getTotalItems();
      startIndex = (this.currentPage - 1) * this.perPage + 1;
      endIndex = Math.min(startIndex + this.perPage - 1, totalItems);
    }

    return `Showing ${startIndex} to ${endIndex} of ${totalItems} items ${filteredItems}.`;
  }

  private getTotalItems(): number {
    if (this.dataMode === DataMode.Filtered) {
      return this.filterData().length;
    }

    return this._data.length;
  }

  // Private method to trigger a table update and custom rendering
  private async updateTable(): Promise<void> {
    if (this.renderFunction) {
      const data = await this.getData();
      this.renderFunction(data);
    }
  }
}

export default EasyTables;
