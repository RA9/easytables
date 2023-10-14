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

  constructor(opts: EasyTablesOptions) {
    this.serverEnabled =
      opts.clientEnabled !== undefined ? opts.clientEnabled : true;
    if (this.serverEnabled) {
      this._data = new Proxy(opts.data || [], {
        set: (target: any, key: string, value) => {
          target[key] = value;
          this.updateTable();
          return true;
        },
      });
    }

    this.perPage = this.serverEnabled
      ? opts.server?.limit || 10
      : opts.data
      ? opts.data.length
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

  // Get data based on the specified data mode (filtered or paginated)
  async getData(): Promise<string[]> {
    if (this.serverEnabled) {
      // Server-side data fetching
      try {
        const response = await fetch(this.serverOptions.api_url, {
          method: "GET",
          headers: this.serverOptions.headers,
        });
        if (response.ok) {
          const rawData = await response.json();
          let actualData = rawData;

          // Check if dataNames is specified and extract the actual data
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
            const startIndex =
              (this.currentPage - 1) * this.serverOptions.limit;
            const endIndex = startIndex + this.serverOptions.limit;

            // Update the _data property with the extracted actual data
            this._data = actualData;

            return actualData.slice(startIndex, endIndex);
          } else {
            // Update the _data property with the extracted actual data
            this._data = actualData;
            return actualData;
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
      // Client-side data handling (same as before)
      if (this.dataMode === DataMode.Filtered) {
        this.dataMode = DataMode.Paginated;
        return this.filterData() as any;
      } else {
        const paginatedData = this._data;
        const startIndex = (this.currentPage - 1) * this.perPage;
        const endIndex = startIndex + this.perPage;
        return paginatedData.slice(startIndex, endIndex) as any;
      }
    }
  }

  // Set the search query
  setSearch(query: string): void {
    if (query.length > 3) {
      // our minor check that saves time
      this.searchQuery = query;
      this.dataMode = DataMode.Filtered;
      this.currentPage = 1; // Reset to the first page when searching
      this.updateTable();
    }
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
    } else if (this.dataMode === DataMode.Paginated) {
      return this.calculateTotalPages(this._data.length);
    } else {
      return 0;
    }
  }

  private calculateTotalPages(totalItems: number): number {
    return Math.ceil(totalItems / this.perPage);
  }

  // Method to get information about the items being displayed
  getShowingInfo(dataMode: DataMode = DataMode.Paginated): string {
    const totalItems = this.getTotalItems(dataMode);
    const startIndex = (this.currentPage - 1) * this.perPage + 1;
    const endIndex = Math.min(startIndex + this.perPage - 1, totalItems);
    return `Showing ${startIndex} to ${endIndex} of ${totalItems} items.`;
  }

  private getTotalItems(dataMode: DataMode): number {
    if (dataMode === DataMode.Filtered) {
      return this.filterData().length;
    } else if (dataMode === DataMode.Paginated) {
      return this._data.length;
    } else {
      return 0;
    }
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
