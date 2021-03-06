const { describe, it, before, afterEach } = require('mocha')
const { expect } = require('chai')
const TodoRepository = require('../src/todo-repository')
const { createSandbox } = require('sinon')

describe('todoRepository', () => {
  let todoRepository
  let sandbox

  before(() => {
    todoRepository = new TodoRepository()
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('methods signature', () => {
    it('should call insert from lokijs', function () {
       const mockDatabase = [{
         name: 'Xuxa da Silva',
         age: 90,
         meta: { revision: 0, created: 16111185653507, version: 0 },
         '$loki': 1
       }]
      const functionName = "find"
      const expectedReturn = mockDatabase
      sandbox.stub(
        todoRepository.schedule,
        functionName
      ).returns(expectedReturn)

      const result = todoRepository.list()
      expect(result).to.be.deep.equal(expectedReturn)
      expect(todoRepository.schedule[functionName].calledOnce).to.be.ok
    })

    it('should call find from lokijs', function () {
      const functionName = "insertOne"
      const expectedReturn = true

      sandbox.stub(
        todoRepository.schedule,
        functionName
      ).returns(expectedReturn)

      const data = { name: 'Felipe' }

      const result = todoRepository.create(data)

      expect(result).to.be.ok
      expect(todoRepository.schedule[functionName].calledOnceWithExactly(data)).to.be.ok
    })
  })
})
