# Project Skeleton Client

The client was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) (CRA) and includes all of capabilities provided by CRA. Some built-in functionality of that skeleton was stripped out, specifically the [offline caching](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app).

## Setup

You should install the dependencies from the "top-level" package as described in its README or via `npm install` in this directory.

The development server will attempt to proxy API requests to the server specified in the `package.json` "proxy" field. The application has been configured to proxy requests to the associated server at http://localhost:3001.

## Development

### Testing

The tests use both Jest and Enzyme has described in the [CRA documentation](https://facebook.github.io/create-react-app/docs/running-tests).

Enzyme was installed with:

```
npm install --save-dev enzyme enzyme-adapter-react-16 react-test-renderer
```

### Linting

You can run the linter with `npm run lint` or `npx eslint .`. A custom ESLint configuration is provided as described in the top-level README. We the Prettier ESlint configuration to prevent conflicts with that tool.

```
npm install --save-dev eslint-config-prettier
```

The `.eslintrc.json` configuration is:

```
{
  "extends": ["react-app", "prettier"],
  "rules": {
    ... Many rules adapted from AirBnB style guide
  }
}
```
