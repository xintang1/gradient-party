import { apiHandler } from '@/helpers/api-handlers'
import templatesRepo from '@/helpers/templates-repo'

export default apiHandler({
    post: addTemplate,
    get: getTemplates,
    patch: updateTemplate,
});

function addTemplate(req, res) {
    const { name,author, ...attributes } = JSON.parse(req.body);
    delete attributes.template
    
    const result = templatesRepo.create({
      name: name,
      author: author,
      attributes: attributes
    })
    return res.status(200).json(result);
}

function getTemplates(req, res) {
  return res.status(200).json(templatesRepo.getAll());
}

function updateTemplate(req, res) {

}