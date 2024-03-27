function gf(init?: number[]): number[] {
	const r = new Array<number>(16, 0);
	if (init) {
		for (let i = 0; i < init.size(); ++i) {
			r[i] = init[i];
		}
	}
	return r;
}

function pack(o: number[], n: number[]) {
	let b: number;
	const m = gf(),
		t = gf();
	for (let i = 0; i < 16; ++i) {
		t[i] = n[i];
	}
	carry(t);
	carry(t);
	carry(t);
	for (let j = 0; j < 2; ++j) {
		m[0] = t[0] - 0xffed;
		for (let i = 1; i < 15; ++i) {
			m[i] = t[i] - 0xffff - ((m[i - 1] >> 16) & 1);
			m[i - 1] &= 0xffff;
		}
		m[15] = t[15] - 0x7fff - ((m[14] >> 16) & 1);
		b = (m[15] >> 16) & 1;
		m[14] &= 0xffff;
		cswap(t, m, 1 - b);
	}
	for (let i = 0; i < 16; ++i) {
		o[2 * i] = t[i] & 0xff;
		o[2 * i + 1] = t[i] >> 8;
	}
}

function carry(o: number[]) {
	let c: number;
	for (let i = 0; i < 16; ++i) {
		o[(i + 1) % 16] += (i < 15 ? 1 : 38) * math.floor(o[i] / 65536);
		o[i] &= 0xffff;
	}
}

function cswap(p: number[], q: number[], b: number) {
	let t: number;
	const c = ~(b - 1);
	for (let i = 0; i < 16; ++i) {
		t = c & (p[i] ^ q[i]);
		p[i] ^= t;
		q[i] ^= t;
	}
}

function add(o: number[], a: number[], b: number[]) {
	for (let i = 0; i < 16; ++i) {
		o[i] = (a[i] + b[i]) | 0;
	}
}

function subtract(o: number[], a: number[], b: number[]) {
	for (let i = 0; i < 16; ++i) {
		o[i] = (a[i] - b[i]) | 0;
	}
}

function multmod(o: number[], a: number[], b: number[]) {
	const t = new Array<number>(31, 0);
	for (let i = 0; i < 16; ++i) {
		for (let j = 0; j < 16; ++j) {
			t[i + j] += a[i] * b[j];
		}
	}
	for (let i = 0; i < 15; ++i) {
		t[i] += 38 * t[i + 16];
	}
	for (let i = 0; i < 16; ++i) {
		o[i] = t[i];
	}
	carry(o);
	carry(o);
}

function invert(o: number[], i: number[]) {
	const c = gf();
	for (let a = 0; a < 16; ++a) {
		c[a] = i[a];
	}
	for (let a = 253; a >= 0; --a) {
		multmod(c, c, c);
		if (a !== 2 && a !== 4) {
			multmod(c, c, i);
		}
	}
	for (let a = 0; a < 16; ++a) {
		o[a] = c[a];
	}
}

function clamp(z: number[]) {
	z[31] = (z[31] & 127) | 64;
	z[0] &= 248;
}

export function generatePublicKey(privateKey: number[]): number[] {
	let r: number;
	const z = new Array<number>(32, 0),
		a = gf([1]),
		b = gf([9]),
		c = gf(),
		d = gf([1]),
		e = gf(),
		f = gf(),
		_121665 = gf([0xdb41, 1]),
		_9 = gf([9]);

	for (let i = 0; i < 32; ++i) {
		z[i] = privateKey[i];
	}

	clamp(z);

	for (let i = 254; i >= 0; --i) {
		r = (z[i >>> 3] >>> (i & 7)) & 1;
		cswap(a, b, r);
		cswap(c, d, r);
		add(e, a, c);
		subtract(a, a, c);
		add(c, b, d);
		subtract(b, b, d);
		multmod(d, e, e);
		multmod(f, a, a);
		multmod(a, c, a);
		multmod(c, b, e);
		add(e, a, c);
		subtract(a, a, c);
		multmod(b, a, a);
		subtract(c, d, f);
		multmod(a, c, _121665);
		add(a, a, d);
		multmod(c, c, a);
		multmod(a, d, f);
		multmod(d, b, _9);
		multmod(b, e, e);
		cswap(a, b, r);
		cswap(c, d, r);
	}

	invert(c, c);
	multmod(a, a, c);
	pack(z, a);

	return z;
}

function generatePresharedKey(): number[] {
	const privateKey = new Array(32, 0).map(() => {
		return math.floor(math.random() * 256);
	});

	return privateKey;
}

export function generatePrivateKey(): number[] {
	const privateKey = generatePresharedKey();
	clamp(privateKey);
	return privateKey;
}
