const currencyList = require("../js/currencyList")
const coinUtil = require("../js/coinUtil")
module.exports=require("./home.html")({
  data(){
    return {
      curs:[],
      fiatConv:0,
      fiat:this.$store.state.fiat,
      loading:false
    }
  },
  methods:{
    push(){
      this.$emit("push",require("./send.js"))
    },
    load(){
      this.curs=[]
      this.fiatConv=0
      currencyList.eachWithPub(cur=>{
        this.loading=true;
        let bal=null;
        cur.getWholeBalanceOfThisAccount()
          .then(res=>{
            bal=res
            
            return coinUtil.getPrice(cur.coinId,this.$store.state.fiat)
          })
          .then(res=>{
            this.fiatConv += res*bal.balance
            this.curs.push({
              coinId:cur.coinId,
              balance:bal.balance,
              unconfirmed:bal.unconfirmed,
              screenName:cur.coinScreenName,
              price:res,
              icon:cur.icon,
            })
            this.loading=false
          })
      })
    }
  },
  store:require("../js/store.js"),
  mounted(){
    this.$nextTick(this.load)
  }
})
