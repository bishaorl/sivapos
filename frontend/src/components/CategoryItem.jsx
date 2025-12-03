import React from "react";
import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
  return (
    <li>
      <Link to={`/dashboard/category/${category.category.toLowerCase()}`}>
        {category.image ? (
          <img src={category.image} alt="..." />
        ) : (
          <img src={require("../images/category.png")} alt="..." />
        )}
        <span>{category.category.split("-").join(" ")}</span>
      </Link>
    </li>
  );
};

export default CategoryItem;
