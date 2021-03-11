const { describe, it, before, afterEach } = require('mocha')
const { expect } = require('chai')
const TodoService = require('../src/todo-service')
const Todo = require('../src/todo')
const { createSandbox } = require('sinon')

describe('todoService', () => {
  let sandbox

  before(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('#list', () => {
    const mockDatabase = [{
      name: 'Xuxa da Silva',
      age: 90,
      meta: { revision: 0, created: 16111185653507, version: 0 },
      '$loki': 1
    }]

    let todoService
    beforeEach(() => {
      const dependencies = {
        todoRepository: {
          list: sandbox.stub().returns(mockDatabase)
        }
      }
      todoService = new TodoService(dependencies)
    })
    it('should return data on a specific format', function () {
      const result = todoService.list()
      const [{meta, $loki, ...expected}] = mockDatabase
      expect(result).to.be.deep.equal([expected])
    })

  })

  describe('#create', () => {
    let todoService
    beforeEach(() => {
      const dependencies = {
        todoRepository: {
          create: sandbox.stub().returns(true)
        }
      }

      todoService = new TodoService(dependencies)
    })

    it('should not save todo item with invalid data', function () {
      const data = new Todo({
        text: '',
        when: ''
      })

      Reflect.deleteProperty(data,  'id')

      const expected = {
        error: {
          message: 'invalid data',
          data: data
        }
      }

      const result = todoService.create(data)
      expect(result).to.be.deep.equal(expected)
    });

    it('should save todo item with late status whe the property when is further than today', () => {
      const properties = {
        text: 'Large, instant pudding  is best blended with hardened peppermint tea.',
        when: new Date('2020-12-01 12:00:00 GMT-0')
      }

      const expectedId = '000001'

      const uuid = require('uuid')
      const fakeUUID = sandbox.fake.returns(expectedId)
      sandbox.stub(uuid, "v4").callsFake(fakeUUID)

      const data = new Todo(properties)

      const today = new Date("2020-12-02")
      sandbox.useFakeTimers(today.getTime())

      todoService.create(data)

      const expectedCallWith = {
        ...data,
        status: "late"
      }

      expect(todoService.todoRepository.create.calledOnceWithExactly(expectedCallWith)).to.be.ok
    });

    it('should save todo item with pending status');
  })
})
