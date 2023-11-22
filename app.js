new Vue({
    el: "#app",
    data: {
        player_health: 100,
        monster_health: 100,
        game_is_on: false,
        logs: [],
        attack_multiple: 10,
        special_attack_multiple: 25,
        monster_attack_multiple: 10,
        heal_up_multiple:20,
        healUpCount: 4,
        givingUp:false,
        log_text: {
            attack: "Player Attack :",
            special_attack: "Player Special Attack :",
            monster_attack: "Monster Attack :",
            heal_up: "Player Heal Up :",
            give_up: "Player Gave Up",
            gameStarted: "Game Started"
        },

    },
    methods: {
        start_game : function () {
            this.game_is_on = true
            this.player_health = 100
            this.monster_health = 100
            this.healUpCount = 4
            this.addToLog({turn: "startGame", message: this.log_text.gameStarted})
            this.logs = []
        },

        attack: function (attack_multiply, log_text, turn, toAttack) {
            var attackHit = Math.ceil(Math.random() * attack_multiply)
            this.healUpCount -= 1
            this.addToLog({turn: turn, message: log_text + attackHit})
            return toAttack -= attackHit
        },

        basic_attack: function () {
            attacked = this.attack(this.attack_multiple, this.log_text.attack, "player", this.monster_health)
            this.monster_health = attacked
            setTimeout(this.monster_attack(), 1000)
        },

        special_attack: function () {
            attacked = this.attack(this.special_attack_multiple, this.log_text.special_attack, "player", this.monster_health)
            this.monster_health = attacked
            this.monster_attack()
        },

        heal: function () {
            var healUp = Math.ceil(Math.random() * this.heal_up_multiple)
            this.player_health += healUp
            this.healUpCount=4
            this.monster_attack()
            this.addToLog({turn: "heal", message: this.log_text.heal_up + healUp})
        },

        give_up: function () {
            this.addToLog({turn: "gaveUp", message: this.log_text.give_up})
            this.player_health = 0
            this.givingUp = true
            this.game_is_on = false
        },

        monster_attack: function () {
            attacked = this.attack(this.monster_attack_multiple, this.log_text.monster_attack, "monster", this.player_health)
            this.player_health = attacked
        },

        addToLog: function (value) {
            this.logs.push(value)
        },
    },
    watch: {
        player_health: function (value) {
            if(value <= 0){
                this.player_health = 0
                if(confirm('You Lost! New Game?')){
                    this.start_game()
                }
            }else if(value >= 100){
                this.player_health = 100
            }
        },
        monster_health: function (value) {
            if(value <= 0){
                this.monster_health = 0
                if(confirm('You Won! New Game?')){
                    this.start_game()
                }
            }
        },
        healUpCount: function (value) {
            if(value <= 0){
                this.healUpCount = 0
            }
        },
    },
    computed : {
        playerProgress: function () {
            return {
                width: this.player_health + "%"
            }
        },
        monsterProgress: function () {
            return {
                width: this.monster_health + "%"
            }
        },
        healUpCountProgress: function () {
            return {
                width: this.healUpCount * 25 + "%"
            }
        }
    }
})
