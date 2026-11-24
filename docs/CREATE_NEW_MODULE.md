# Create a new module

1. Choose a name for your module.

    💡 If your module is using a third-party service (like _Google Lighthouse_ or _MySQL_), you may want to use this name, as it will help other users to quickly identify what your module is about.

    For the rest of this guide, we will use the fictive third-party service _Beat_, so our module name will be `Beat`.

2. Run the `moon generate package` and answer the questions.

3. Update the following fields of the package.json file:
    - `description`
    - `license`
    - `contributors`

4. Make moon aware of your new module by running the `moon sync projects` command.

5. Make sure everything is fine by building your module and run the _lint_ and _test_ steps:
    1. `moon run beat:build`
    2. `moon run beat:check`
    3. `moon run beat:test`

You now have a new empty working module and can start the implementation of your business code.

💡 If you have some difficulties to implement your new module, take a look at the existing packages to help you.
