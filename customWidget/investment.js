class investment {
    constructor() {
      this._id = '';
      this._desc = '';
      this._tax_class = '';
    }
  
    // Getter and Setter for 'id'
    get id() {
      return this._id;
    }
    set id(newId) {
      this._id = newId;
    }
  
    // Getter and Setter for 'desc'
    get desc() {
      return this._desc;
    }
    set desc(newDesc) {
      this._desc = newDesc;
    }
  
    // Getter and Setter for 'tax_class'
    get tax_class() {
      return this._tax_class;
    }
    set tax_class(newTaxClass) {
      this._tax_class = newTaxClass;
    }
  }
  
  // Export the class for use in other files
  export default investment;
  