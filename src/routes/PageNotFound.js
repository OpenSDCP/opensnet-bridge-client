import React from "react";

// Router
import { Link } from "react-router-dom";

export const PageNotFound = () => {
  return (
    <div>
      This page does not exist (anymore?). <Link to="/">Go home</Link>
    </div>
  );
};