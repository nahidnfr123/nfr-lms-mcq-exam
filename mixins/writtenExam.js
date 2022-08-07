export default {
  methods: {
    checkAnswer() {
      if (this.formData.answer && this.formData.answer.length) {
        if (this.question.answers && this.question.answers.length) {
          const n = this.closestAnswerIndex

          this.matchString(n)

          const answer = this.formData.answer.trim()
          let icCorrect = false

          this.question.answers.forEach((obj) => {
            if (answer === obj.text) icCorrect = true
          })
          if (icCorrect) {
            this.formData.obtained_mark = this.question.mark
            this.answerReview = '<span style="font-size: 12px"><span class="success--text">Correct</span> Answer</span>'
          } else {
            this.formData.obtained_mark = 0
            this.answerReview = '<span style="font-size: 12px"><span class="error--text">Wrong</span> Answer</span>'
          }
        }
      } else {
        this.answerReview = '<span class="warning--text">Not answered</span>'
      }
    },
    matchString() {
      this.answerRewrite = ''
      this.answerRewrites = []
      /// Match Each answers and get the percentage match...
      const StudentAnswer = this.formData.answer.trim()

      if (this.question.answers && this.question.answers.length) {
        this.question.answers.forEach((obj, n) => {
          const GivenAnswer = this.question.answers[n].text

          if (GivenAnswer) {
            this.answerRewrites.push({'answer': diffString(StudentAnswer, GivenAnswer), 'percentage': this.similarityPercentage(StudentAnswer, GivenAnswer)})
          }
          // this.answerRewrites.push(diffString2(StudentAnswer, GivenAnswer))
        })
      }
      /// End ....

      // Get Best match answer
      const percentageArray = []

      this.answerRewrites.forEach((obj) => {
        percentageArray.push(obj.percentage)
      })
      const highestPercentageMatch = Math.max(...percentageArray)
      const index = percentageArray.indexOf(highestPercentageMatch)

      if (index >= 0) {
        // console.log(highestPercentageMatch, index)
        const GA = this.question.answers[index].text

        if (StudentAnswer) {
          /// Save data tp form
          this.formData.percentage_match = highestPercentageMatch
          this.formData.best_match_answer = GA
          /// End ...
          this.answerRewrite = diffString(StudentAnswer, GA)
        } else {
          this.answerRewrite = `<ins style="color: #82ef17; padding: 0 2px">${GA}</ins>`
        }
      }

      // End ....

      function escape(s) {
        let n = s

        n = n.replace(/&/g, '&amp;')
        n = n.replace(/</g, '&lt;')
        n = n.replace(/>/g, '&gt;')
        n = n.replace(/"/g, '&quot;')

        return n
      }

      function diffString(o, n) {
        o = o.replace(/\s+$/, '')
        n = n.replace(/\s+$/, '')
        const out = diff(o === '' ? [] : o.split(/\s+/), n === '' ? [] : n.split(/\s+/))
        let str = ''

        let oSpace = o.match(/\s+/g)

        if (oSpace == null) oSpace = ['\n']
        else oSpace.push('\n')

        let nSpace = n.match(/\s+/g)

        if (nSpace == null) nSpace = ['\n']
        else nSpace.push('\n')

        if (out.n.length === 0) {
          for (let i = 0; i < out.o.length; i++) {
            str += '<del style="color: red;">' + escape(out.o[i]) + oSpace[i] + '</del>'
          }
        } else {
          if (out?.n[0]?.text == null) {
            for (n = 0; n < out.o.length && out?.o[n]?.text == null; n++) {
              str += '<del style="color: red;">' + escape(out.o[n]) + oSpace[n] + '</del>'
            }
          }

          for (let i = 0; i < out.n.length; i++) {
            if (out?.n[i]?.text == null) {
              str += '<ins style="color: #82ef17; padding: 0 2px">' + escape(out.n[i]) + nSpace[i] + '</ins>'
            } else {
              let pre = ''

              for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++) {
                pre += '<del style="color: red;">' + escape(out.o[n]) + oSpace[n] + '</del>'
              }
              str += ' ' + out.n[i].text + nSpace[i] + pre
            }
          }
        }
        return str
      }

      function randomColor() {
        return 'rgb(' + (Math.random() * 100) + '%, ' +
          (Math.random() * 100) + '%, ' +
          (Math.random() * 100) + '%)'
      }

      /*function diffString2(o, n) {
          o = o.replace(/\s+$/, '');
          n = n.replace(/\s+$/, '');

          let out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/));

          let oSpace = o.match(/\s+/g);
          if (oSpace == null) {
              oSpace = ["\n"];
          } else {
              oSpace.push("\n");
          }
          let nSpace = n.match(/\s+/g);
          if (nSpace == null) {
              nSpace = ["\n"];
          } else {
              nSpace.push("\n");
          }

          let os = "";
          let colors = new Array();
          for (let i = 0; i < out.o.length; i++) {
              colors[i] = randomColor();

              if (out.o[i].text != null) {
                  os += '<span style="background-color: ' + colors[i] + '">' +
                      escape(out.o[i].text) + oSpace[i] + "</span>";
              } else {
                  os += "<del style='color: red'>" + escape(out.o[i]) + oSpace[i] + "</del>";
              }
          }

          let ns = "";
          for (let i = 0; i < out.n.length; i++) {
              if (out.n[i].text != null) {
                  ns += '<span style="background-color: ' + colors[out.n[i].row] + '">' +
                      escape(out.n[i].text) + nSpace[i] + "</span>";
              } else {
                  ns += "<ins style='color: #82ef17; padding: 0 2px'>" + escape(out.n[i]) + nSpace[i] + "</ins>";
              }
          }

          return {o: os, n: ns};
      }*/

      function diff(o, n) {
        const ns = {}
        const os = {}

        for (let i = 0; i < n.length; i++) {
          if (ns[n[i]] == null)
            ns[n[i]] = {rows: [], o: null}
          ns[n[i]].rows.push(i)
        }

        for (let i = 0; i < o.length; i++) {
          if (os[o[i]] == null)
            os[o[i]] = {rows: [], n: null}
          os[o[i]].rows.push(i)
        }

        for (const i in ns) {
          if (ns[i].rows.length === 1 && typeof (os[i]) !== 'undefined' && os[i].rows.length === 1) {
            n[ns[i].rows[0]] = {text: n[ns[i].rows[0]], row: os[i].rows[0]}
            o[os[i].rows[0]] = {text: o[os[i].rows[0]], row: ns[i].rows[0]}
          }
        }

        for (let i = 0; i < n.length - 1; i++) {
          if (n[i].text != null && n[i + 1].text == null && n[i].row + 1 < o.length && o[n[i].row + 1].text == null &&
            n[i + 1] === o[n[i].row + 1]) {
            n[i + 1] = {text: n[i + 1], row: n[i].row + 1}
            o[n[i].row + 1] = {text: o[n[i].row + 1], row: i + 1}
          }
        }

        for (let i = n.length - 1; i > 0; i--) {
          if (n[i].text != null && n[i - 1].text == null && n[i].row > 0 && o[n[i].row - 1].text == null &&
            n[i - 1] == o[n[i].row - 1]) {
            n[i - 1] = {text: n[i - 1], row: n[i].row - 1}
            o[n[i].row - 1] = {text: o[n[i].row - 1], row: i - 1}
          }
        }

        return {o: o, n: n}
      }
    },
    similarityPercentage($str1, $str2) {
      /*let txt = "The strings: <span class=\"str\">'" + $str1 + "'</span> and <span class=\"str\">'" + $str2 + "'</span>";
      txt += "<br>are similar <span class=\"perc\">" + percentage + "%</span>";*/
      return Math.round(similarity($str1, $str2) * 10000) / 100

      function similarity(s1, s2) {
        let longer = s1
        let shorter = s2

        if (s1.length < s2.length) {
          longer = s2
          shorter = s1
        }
        const longerLength = longer.length

        if (longerLength === 0) {
          return 1.0
        }

        return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
      }

      function editDistance(s1, s2) {
        s1 = s1.toLowerCase()
        s2 = s2.toLowerCase()

        const costs = []

        for (let i = 0; i <= s1.length; i++) {
          let lastValue = i

          for (let j = 0; j <= s2.length; j++) {
            if (i == 0)
              costs[j] = j
            else {
              if (j > 0) {
                let newValue = costs[j - 1]

                if (s1.charAt(i - 1) != s2.charAt(j - 1))
                  newValue = Math.min(Math.min(newValue, lastValue),
                    costs[j]) + 1
                costs[j - 1] = lastValue
                lastValue = newValue
              }
            }
          }
          if (i > 0)
            costs[s2.length] = lastValue
        }

        return costs[s2.length]
      }
    }
  }
}
