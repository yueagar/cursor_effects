((e, $, o) => {
    const drawer = new class {
        constructor() {
            this.author = "YueAgar_c",
            this.version = "1.0.0",
            this.type = "cursor",
            this.canvas = o.getElementById("canvas"),
            this.ready()
        }
        ready() {
            this.renderer = new PIXI.Renderer({
                view: this.canvas,
                width: e.innerWidth,
                height: e.innerHeight,
                resolution: e.devicePixelRatio,
                backgroundColor: 0x000000,
                autoDensity: !0,
                antialias: !1
            }),
            e.onresize = () => {
                this.canvas.width = 0 | e.innerWidth,
                this.canvas.height = 0 | e.innerHeight,
                this.renderer.resize(this.canvas.width, this.canvas.height)
            },
            this.pos = {
                x: e.innerWidth/2,
                y: e.innerHeight/2
            },
            this.getRandomVel = e => {
                e < .25 && (e = Math.random());
                return e < .25 ? this.getRandomVel(e) : e;
            },
            this.fps = 0,
            this.frame = 0,
            this.frameTime = 0,
            this.time = 0,
            this.latency = 250,
            this.trails = new Map(),
            this.particles = [];
            for (let i = 0; i < 40; i++) this.particles.push({
                "ok": false,
                "time": Date.now(),
                "diffTime": 0,
                "x": 0,
                "diffX": 0,
                "y": 0,
                "diffY": 0,
                "vel": 0,
                "angle": 0
            });
            this.stage = new PIXI.Container(),
            this.graphics = new PIXI.Graphics(),
            this.text = new PIXI.Text(),
            this.loop = new PIXI.Ticker(),
            this.loop.add(delta => {
                this.draw(delta)
            }),
            this.loop.start(),
            o.body.addEventListener("mousemove", event => {
                //console.log("move"),
                this.pos.x = event.clientX,
                this.pos.y = event.clientY
            }),
            o.body.addEventListener("contextmenu", event => {
                event.preventDefault()
            })
        }
        draw(delta) {
            this.time = Date.now(),
            this.frame++,
            (this.time - this.frameTime) > 1000 && (this.fps = this.frame, this.frame = 0, this.frameTime = this.time),
            this.trails.set(this.time, {
                "time": this.time,
                "x": this.pos.x,
                "y": this.pos.y
            }),
            this.graphics.clear(),
            this.stage.removeChildren(),
            this.particles.length > 0 && this.particles.forEach(t => {
                t.diffTime = this.time - t.time,
                t.diffRatio = (t.diffX - t.x)/(1000 * Math.cos(t.angle)/10),
                (t.diffRatio >= 1 || !t.ok || t.diffTime > this.latency * 40) ? (
                    t.time = this.time,
                    t.diffTime = 0,
                    t.diffRatio = 0,
                    t.x = this.pos.x,
                    t.y = this.pos.y,
                    t.vel = this.getRandomVel(Math.random()),
                    t.angle = Math.random() * 2 * Math.PI,
                    t.ok = true
                ) : t.ok && t.diffTime > 0 && t.diffRatio < 1 && (
                    t.diffX = t.x + t.diffTime * Math.cos(t.angle)/10 * t.vel,
                    t.diffY = t.y + t.diffTime * Math.sin(t.angle)/10 * t.vel,
                    this.graphics.beginFill(0xffffff, Math.abs(1-t.diffRatio)),
                    this.graphics.drawCircle(t.diffX + 35 * Math.cos(t.angle), t.diffY + 35 * Math.sin(t.angle), 10 * (t.diffX - t.x)/(1000 * Math.cos(t.angle)/10)),
                    this.graphics.endFill()
                )
            }),
            this.trails.size > 0 && this.trails.forEach(t => {
                (this.time - t.time) > this.latency ? this.trails.delete(t.time)
                : (
                    this.graphics.beginFill(0xff0000, Math.abs(this.latency - (this.time - t.time))/this.latency),
                    this.graphics.drawCircle(t.x, t.y, Math.abs(this.latency - (this.time - t.time))/(this.latency/20)),
                    this.graphics.endFill()
                )
            }),
            this.text.text = `FPS: ${this.fps}`,
            this.text.style.align = "center",
            this.text.style.fill = 0xffffff,
            this.text.style.fontSize = "30px",
            this.text.anchor.set(0, 1),
            this.text.position.set(0, e.innerHeight)
            this.stage.addChild(this.graphics, this.text),
            this.renderer.render(this.stage)
        }
    }
    e.drawer = drawer;
})(window, $, document);