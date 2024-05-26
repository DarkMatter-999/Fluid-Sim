class Vector2 {
	constructor(x, y) {
		this.x = x;
		this.y = y
	}

	Normalize() {
		let length = this.Length();
		this.x /= length;
		this.y /= length;
	}

	Length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	Length2() {
		return this.x * this.x + this.y * this.y;
	}

	GetNormal() {
		return new Vector2(this.y, - this.x);
	}

	Dot(other) {
		return this.x * other.x + this.y * other.y;
	}

	Log() {
		console.log("Vector2d", this.x, this.y);
	}

	Cpy() {
		return new Vector2(this.x, this.y);
	}

	static Zero() {
		return new Vector2(0.0, 0.0);
	}
}

function Add(A, B) {
	return new Vector2(A.x + B.x, A.y + B.y);
}

function Sub(A, B) {
	return new Vector2(A.x - B.x, A.y - B.y);
}

function Scale(vec, scalar) {
	return new Vector2(vec.x * scalar, vec.y * scalar);
}
