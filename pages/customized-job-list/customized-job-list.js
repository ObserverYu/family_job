var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const app = getApp()

Page({
    data: {
        typeId:0,
        typeName:'',
        jobList: [],
        cartTotal: {
            "goodsCount": 0,
            "goodsAmount": 0.00,
            "checkedGoodsCount": 0,
            "checkedGoodsAmount": 0.00,
            "userId_test": ''
        },
        isEditCart: false,
        checkedAllStatus: true,
        editCartList: [],
        isTouchMove: false,
        startX: 0, //开始坐标
        startY: 0,
        hasJob: 0
    },
    onLoad: function(options) {
        this.setData({
            familyOwner:options.familyOwner,
            typeId:options.id
        });
    },
    onReady: function() {
        // 页面渲染完成
    },
    onShow: function() {
        // 页面显示
        this.getJobList();
    },
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading()
        this.getJobList();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    },
    
    getJobList: function() {
        let that = this;
        util.request(api.GetCustomizedJobList,{
            typeId:this.data.typeId
        }).then(function(res) {
            if (res.code === 200) {
                if(res.data != null && res.data != ''){
                    let jobList = []
                    if(res.data.jobList != null){
                        jobList = res.data.jobList
                    }
                    that.setData({
                        jobList: res.data.jobList
                        ,typeName:res.data.typeName
                    });
                    let title = res.data.typeName + "(家长可左滑删除)"
                    wx.setNavigationBarTitle({
                        title: title
                    })
                }
            }
        });
    },

    isCheckedAll: function() {
        //判断购物车商品已全选
        return this.data.jobList.every(function(element, index, array) {
            if (element.checked == true) {
                return true;
            } else {
                return false;
            }
        });
    },
    getCheckedGoodsCount: function() {
        let checkedGoodsCount = 0;
        let checkedGoodsAmount = 0;

        this.data.jobList.forEach(function(v) {
            if (v.checked == true) {
                checkedGoodsCount += v.number;
                checkedGoodsAmount += v.number * v.retail_price
            }
        });
        this.setData({
            'cartTotal.checkedGoodsCount': checkedGoodsCount,
            'cartTotal.checkedGoodsAmount': checkedGoodsAmount,
        });
    },
    checkedAll: function() {
        let that = this;
        if (!this.data.isEditCart) {
            var productIds = this.data.jobList.map(function(v) {
                return v.product_id;
            });
            util.request(api.CartChecked, {
                productIds: productIds.join(','),
                isChecked: that.isCheckedAll() ? 0 : 1
            }, 'POST').then(function(res) {
                if (res.errno === 0) {
                    that.setData({
                        jobList: res.data.cartList,
                        cartTotal: res.data.cartTotal
                    });
                }

                that.setData({
                    checkedAllStatus: that.isCheckedAll()
                });
            });
        } else {
            //编辑状态
            let checkedAllStatus = that.isCheckedAll();
            let tmpCartData = this.data.jobList.map(function(v) {
                v.checked = !checkedAllStatus;
                return v;
            });
            getCheckedGoodsCount();
            that.setData({
                jobList: tmpCartData,
                checkedAllStatus: that.isCheckedAll(),
            });
        }

    },
    updateCart: function(itemIndex, productId, number, id) {
        let that = this;
        wx.showLoading({
            title: '',
            mask:true
          })
        util.request(api.CartUpdate, {
            productId: productId,
            number: number,
            id: id
        }, 'POST').then(function(res) {
            if (res.errno === 0) {
                that.setData({
                    jobList: res.data.cartList,
                    cartTotal: res.data.cartTotal
                });
                let cartItem = that.data.jobList[itemIndex];
                cartItem.number = number;
                that.getCartNum();
            } else {
                util.showErrorToast('库存不足了')
            }
            that.setData({
                checkedAllStatus: that.isCheckedAll()
            });
            wx.hideLoading({
            })
        });

    },
    cutNumber: function(event) {
        let itemIndex = event.target.dataset.itemIndex;
        let cartItem = this.data.jobList[itemIndex];
        if (cartItem.number - 1 == 0) {
            util.showErrorToast('删除左滑试试')
        }
        let number = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1;
        this.setData({
            jobList: this.data.jobList,
        });
        this.updateCart(itemIndex, cartItem.product_id, number, cartItem.id);
    },
    addNumber: function(event) {
        let itemIndex = event.target.dataset.itemIndex;
        let cartItem = this.data.jobList[itemIndex];
        let number = Number(cartItem.number) + 1;
        this.setData({
            jobList: this.data.jobList,
        });
        this.updateCart(itemIndex, cartItem.product_id, number, cartItem.id);
    },
    getCartNum: function() {
        util.request(api.jobListCount).then(function(res) {
            if (res.errno === 0) {
                let jobListCount = '';
                if (res.data.cartTotal.goodsCount == 0) {
                    wx.removeTabBarBadge({
                        index: 2,
                    })
                } else {
                    jobListCount = res.data.cartTotal.goodsCount + '';
                    wx.setTabBarBadge({
                        index: 2,
                        text: jobListCount
                    })
                }
            }
        });
    },
    checkoutOrder: function() {
        //获取已选择的商品
        util.loginNow();
        let that = this;
        var checkedGoods = this.data.jobList.filter(function(element, index, array) {
            if (element.checked == true) {
                return true;
            } else {
                return false;
            }
        });
        if (checkedGoods.length <= 0) {
            util.showErrorToast('你好像没选中商品');
            return false;
        }
        wx.navigateTo({
            url: '/pages/order-check/index?addtype=0'
        })
    },
    selectTap: function(e) {
        const index = e.currentTarget.dataset.index;
        const list = this.data.goodsList.list;
        if (index !== '' && index != null) {
            list[parseInt(index, 10)].active = !list[parseInt(index, 10)].active;
            this.setGoodsList(this.getSaveHide(), this.totalPrice(), this.allSelect(), this.noSelect(), list);
        }
    },

    checkedItem: function(e) {
        let itemIndex = e.currentTarget.dataset.itemIndex;
        let that = this;

        if (!this.data.isEditCart) {
            util.request(api.CartChecked, {
                productIds: that.data.jobList[itemIndex].product_id,
                isChecked: that.data.jobList[itemIndex].checked ? 0 : 1
            }, 'POST').then(function(res) {
                if (res.errno === 0) {
                    that.setData({
                        jobList: res.data.cartList,
                        cartTotal: res.data.cartTotal
                    });
                }

                that.setData({
                    checkedAllStatus: that.isCheckedAll()
                });
            });
        } else {
            //编辑状态
            let tmpCartData = this.data.jobList.map(function(element, index, array) {
                if (index == itemIndex) {
                    element.checked = !element.checked;
                }

                return element;
            });
            this.getCheckedGoodsCount();
            that.setData({
                jobList: tmpCartData,
                checkedAllStatus: that.isCheckedAll(),
                // 'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
            });
        }
    },
    handleTap: function(event) { //阻止冒泡 

    },

    touchstart: function(e) {
        //开始触摸时 重置所有删除
        this.data.jobList.forEach(function(v, i) {
            if (v.isTouchMove) //只操作为true的
                v.isTouchMove = false;
        })
        this.setData({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY,
            jobList: this.data.jobList
        })
    },
    //滑动事件处理
    touchmove: function(e) {
        if(this.data.familyOwner != 1){
            wx.showToast({
                title: "只有家长可删除",
                icon: 'none',
                duration: 1000
            })
            return;
        }
        var that = this,
            index = e.currentTarget.dataset.index, //当前索引
            startX = that.data.startX, //开始X坐标
            startY = that.data.startY, //开始Y坐标
            touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
            touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
            //获取滑动角度
            angle = that.angle({
                X: startX,
                Y: startY
            }, {
                X: touchMoveX,
                Y: touchMoveY
            });
        that.data.jobList.forEach(function(v, i) {
            v.isTouchMove = false
            //滑动超过30度角 return
            if (Math.abs(angle) > 30) return;
            if (i == index) {
                if (touchMoveX > startX) //右滑
                    v.isTouchMove = false
                else //左滑
                    v.isTouchMove = true
            }
        })
        //更新数据
        that.setData({
            jobList: that.data.jobList
        })
    },
    /**
     * 计算滑动角度
     * @param {Object} start 起点坐标
     * @param {Object} end 终点坐标
     */
    angle: function(start, end) {
        var _X = end.X - start.X,
            _Y = end.Y - start.Y
        //返回角度 /Math.atan()返回数字的反正切值
        return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },
    
    //删除事件
    deleteJob: function(e) {
        //获取已选择的商品
        let jobInfoId = e.currentTarget.dataset.itemIndex;
        console.info(jobInfoId);
        let that = this;
        wx.showModal({
            title: '提示',
            content: '您确定要删除该项目吗？',
            success: function(res) {
                if (res.confirm) {
                    util.request(api.DeleteCustomizedJob, {
                        jobInfoId: jobInfoId
                    }, 'POST').then(function(res) {
                        if (res.code === 200) {
                            util.showErrorToast('移除成功');
                            let jobList = res.data.jobList;
                            that.setData({
                                jobList: jobList
                            });
                            //that.getJobList();
                        }else{
                            wx.showToast({
                                title: res.message,
                                icon: 'none',
                                duration: 1000
                            })
                        }
                    });
                }
            }
        })
      

    }
})