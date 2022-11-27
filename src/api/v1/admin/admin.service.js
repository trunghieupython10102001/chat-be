const { HistoryPointExchangeService } = require('../historyexchangepoint/historyexchangepoint.service')

module.exports = {
  AdminService: {
    payoutForId: async (id) => {
        const listItems = await HistoryPointExchangeService.findOneById(id)
        return listItems;
    },
  },
}
