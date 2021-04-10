var dependencies = {}

let FUNCTION_TYPE = typeof function(){}

let add = (name, dependency) => {
    dependencies[name] = dependency;
}

let resolve = (name) => {
    let resolveFn = this;

    let dep = dependencies[name];
    let depType = typeof dep;

    if (depType == FUNCTION_TYPE) {
        dep = dep(resolveFn);
    }

    return dep;
}

let Container = {
    add,
    resolve
};

export default Container 
//Each object would take in a list of names of dependencies
//Then the object instantiation would resolve it's own dependencies by calling into `resolve`

//Other option would be to resolve it in the dependency itself somehow