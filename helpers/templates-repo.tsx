const fs = require('fs');

interface TemplateProps {
    id?: number,
    name: string,
    author: string,
    attributes: TemplateAtributesProps,
    createdAt?: string,
    updatedAt?: string,
}

interface TemplateAtributesProps {
    style: string,
    direction: string,
    colors: Array<string>,
    output: string
}

// templates in JSON file for simplicity, store in a db for production applications
let templates = require('data/templates.json');

const templatesRepo = {
    getAll: () => templates,
    getById: id => templates.find(x => x.id.toString() === id.toString()),
    find: x => templates.find(x),
    create,
    update,
    delete: _delete
};

function create( template:TemplateProps) {
    // generate new template id
    template.id = templates.length ? Math.max(...templates.map(x => x.id)) + 1 : 1;

    // set date created and updated
    template.createdAt = new Date().toISOString();
    template.updatedAt = new Date().toISOString();

    // add and save template
    templates.push(template);
    saveData();
}

function update(id, params) {
    const template = templates.find(x => x.id.toString() === id.toString());

    // set date updated
    template.updatedAt = new Date().toISOString();

    // update and save
    Object.assign(template, params);
    saveData();
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
function _delete(id) {
    // filter out deleted template and save
    templates = templates.filter(x => x.id.toString() !== id.toString());
    saveData();
}

// private helper functions

function saveData() {
    fs.writeFileSync('data/templates.json', JSON.stringify(templates, null, 4));
}

export default templatesRepo;