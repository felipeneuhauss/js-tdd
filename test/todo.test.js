const { describe, it, before } = require('mocha')
const { expect } = require('chai')
const Todo = require('../src/todo')
const { createSandbox } = require('sinon')


describe('todo', () => {
  describe('#isValid', () => {
    let sandbox
    beforeEach(() => {
      sandbox = createSandbox()
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('should return invalid when creating an object without text', function () {
      const data = {
        text: '',
        when: new Date('2020-12-01'),
      }

      const todo = new Todo(data)
      const result = todo.isValid()
      expect(result).to.be.not.ok
    });

    it("should return invalid when creating an object using the 'when' property invalid", function () {
      const data = {
        text: '',
        when: new Date('20-12-01'),
      }

      const todo = new Todo(data)
      const result = todo.isValid()
      expect(result).to.be.not.ok
    });

    it("should have id, text, when and status after creating object", function () {
      const data = {
        text: 'Always balanced shape the psychic lotus.',
        when: new Date('2020-12-01'),
      }

      const expectedId = '000001'

      const uuid = require('uuid')
      const fakeUUID = sandbox.fake.returns(expectedId)
      sandbox.stub(uuid, "v4").callsFake(fakeUUID)

      let todo = new Todo(data)

      const result = todo.isValid()
      expect(result).to.be.ok

      const {id, ...todoItem} = todo

      const expectedItem = {
        text: data.text,
        when: data.when,
        status: ''
      }

      expect(todoItem).to.be.deep.equals(expectedItem)
    });
  })
})
