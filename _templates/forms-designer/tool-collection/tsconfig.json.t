---
to: packages/<%= name.split("/")[1] %>/tsconfig.json
---
{
  "extends": "@formswizard/designer-tsconfig/react-library.json",
  "include": ["src"],
  "exclude": ["dist", "build", "node_modules"],
  "compilerOptions": {
    "strict": false,
    "resolveJsonModule": true
  }
}
