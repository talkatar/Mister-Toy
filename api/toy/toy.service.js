const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const {ObjectId} = require('mongodb')

async function query(filterBy,SortBy) {
 
    try {
        const criteria = _buildCriteria(filterBy)
        const sortCriteria = _sortCriteria(SortBy)
        const collection = await dbService.getCollection('toy')
        var toys = await collection.find(criteria).sort(sortCriteria).toArray()

        return toys
    } catch (err) {
        logger.error('cannot find toys', err)
        throw err
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = collection.findOne({ _id: ObjectId(toyId) })
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: ObjectId(toyId) })
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}

async function add(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.insertOne(toy)
        return toy
    } catch (err) {
        logger.error('cannot insert toy', err)
        throw err
    }
}

async function update(toy) {
    try {
        const toyToSave = {
            name : toy.name,
            price : toy.price,
            labels : toy.labels,
            inStock : toy.inStock,
            msgs : toy.msgs,
          
        }
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId(toy._id) }, { $set: toyToSave })
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${toyId}`, err)
        throw err
    }
}

async function addToyMsg(toyId, msg) {
    try {
        console.log('toyId, msg',toyId, msg);
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId(toyId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}

async function removeToyMsg(toyId, msgId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId(toyId) }, { $pull: { msgs: {id: msgId} } })
        return msgId
    } catch (err) {
        logger.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
  
    if (filterBy.name) {
      criteria.name = { $regex: filterBy.name, $options: 'i' }
    }
  
    if (filterBy.labels.length) {
      criteria.labels = { $in: filterBy.labels }
    }
  
    if (filterBy.inStock) {
        criteria.inStock = { $eq: filterBy.inStock }
    }
  
    return criteria
  }
  function _sortCriteria(sortBy) {


  const sortCriteria = {}

  sortBy.by === 'name'
    ? sortCriteria.name = sortBy.desc === 1 ? 1 : -1
    : sortCriteria.price = sortBy.desc === 1 ? 1 : -1

  return sortCriteria
}
  
  
module.exports = {
    remove,
    query,
    getById,
    add,
    update,
    addToyMsg,
    removeToyMsg
}
