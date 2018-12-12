class MyPromise {
	constructor(fn) {
		this.state = 'pendding';
		this.callbacks = [];
		this.value = null;
		this.mythen = this.mythen.bind(this);
		this.handle = this.handle.bind(this);
		this.myresolve = this.myresolve.bind(this);
		this.myreject = this.myreject.bind(this);
		this.execute = this.execute.bind(this);
		fn(this.myresolve, this.myreject); // 执行fn
	}

	mythen(onFulfilled, onRejected) {
		return new MyPromise((myresolve, myreject) => {
			this.handle({
				onFulfilled: onFulfilled || null,
				onRejected: onRejected || null,
				myresolve: myresolve,
				myreject: myreject
			})
		})
	}

	handle(callback) {

		if(this.state === 'pendding') {
		this.callbacks.push(callback);
			return;
		}

		let cb = this.state === 'fulfilled'? callback.onFulfilled : callback.onRejected;
		let ret;

		if(cb === null) {
			cb = this.state === 'fulfilled'?callback.myresolve : callback.myrejected;
			cb(value);
			return;
		}


		try {
			ret = cb(this.value);
			callback.myresolve(ret);
		} catch(e) {
			callback.myreject(e);
			console.log('this is error: ', e);
		}

		
	}


	myresolve(newValue) {

		if(newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
			let mythen = newValue.mythen;
			if(typeof mythen === 'function'){
				mythen.call(newValue, myresolve, myreject);
				return;
			}
		}

		this.state = 'fulfilled';


		this.value = newValue;


		this.execute();
	}

	myreject(reason) {
		setTimeout(() => {
			this.callbacks.map(callback => {
				this.handle(callback);
			});
		}, 0);
	}

	execute() {
		setTimeout(() => {
			this.callbacks.map(callback => {
				this.handle(callback);
			});
		});
	}

}



let me = new MyPromise((myresolve, myreject) => {
	setTimeout(() => {
		let a = '异步结果';
		console.log('first', this);
		myresolve(a);
	}, 1000);
})

me.mythen(res => {
	console.log('onfulfilled: ', res);
});

