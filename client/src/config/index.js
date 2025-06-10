export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "fantasy", label: "Fantasy" },
      { id: "thriller", label: "Thriller" },
      { id: "adventure", label: "Adventure" },
      { id: "mystery", label: "Mystery" },
      { id: "fiction", label: "Fiction" },
      { id: "romance", label: "Romance" },
      { id: "history", label: "History" },
      { id: "biography", label: "Biography" },
      { id: "horror", label: "Horror" },
    ],
  },
  {
    label: "Language",
    name: "brand",
    componentType: "select",
    options: [
      { id: "english", label: "English" },
      { id: "hindi", label: "Hindi" },
      { id: "telugu", label: "Telugu" },
      { id: "tamil", label: "Tamil" },
      { id: "korean", label: "Korean" },
      { id: "marathi", label: "Marathi" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "read",
    label: "Read",
    path: "/read",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "fantasy",
    label: "Fantasy",
    path: "/shop/listing",
  },
  {
    id: "thriller",
    label: "Thriller",
    path: "/shop/listing",
  },
  {
    id: "adventure",
    label: "Adventure",
    path: "/shop/listing",
  },
  {
    id: "mystery",
    label: "Mystery",
    path: "/shop/listing",
  },
  {
    id: "fiction",
    label: "Fiction",
    path: "/shop/listing",
  },
  {
    id: "romance",
    label: "Romance",
    path: "/shop/listing",
  },
  {
    id: "history",
    label: "History",
    path: "/shop/listing",
  },
  {
    id: "biography",
    label: "Biography",
    path: "/shop/listing",
  },
  {
    id: "horror",
    label: "Horror",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  fantasy: "Fantasy",
  thriller: "Thriller",
  adventure: "Adventure",
  mystery: "Mystery",
  fiction: "Fiction",
  romance: "Romance",
  history: "History",
  biography: "Biography",
  horror: "Horror",
};

export const brandOptionsMap = {
  english: "English",
  hindi: "Hindi",
  telugu: "Telugu",
  tamil: "Tamil",
  korean: "Korean",
  marathi: "Marathi",
};

export const filterOptions = {
  category: [
    { id: "fantasy", label: "Fantasy" },
    { id: "thriller", label: "Thriller" },
    { id: "adventure", label: "Adventure" },
    { id: "mystery", label: "Mystery" },
    { id: "fiction", label: "Fiction" },
    { id: "romance", label: "Romance" },
    { id: "history", label: "History" },
    { id: "biography", label: "Biography" },
    { id: "horror", label: "Horror" },
  ],
  brand: [
    { id: "english", label: "English" },
    { id: "hindi", label: "Hindi" },
    { id: "telugu", label: "Telugu" },
    { id: "tamil", label: "Tamil" },
    { id: "korean", label: "Korean" },
    { id: "marathi", label: "Marathi" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
