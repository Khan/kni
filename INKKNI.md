
# Differences with Inkle’s Ink

Kni is an homage, inspired by Inkle’s Ink.
The languages have several key ideas in common.

- They h[H]ave pithy notation for question/answer narrative for options,
  including * show-once options, + show forever options, and * [] fall through
  when options are exhausted options.
- They have {curly|braces|delimited|by|pipes} for meta-narrative.
- They have the divert or goto arrow ``->``.
- They collect threads of narrative after nested option groups.
- They both generate a JSON artifact that separates their parser from their
  runtime.

It is said that despite these similarities, Kni differs from Ink in many
glaring ways, particularly the letters are in the wrong order, and it has
“DON’T PANIC” written on the cover in large, friendly letters.

- Superficially, Kni is entirely implemented in JavaScript, so you can run
  every part of it in the browser or on a server.

- Kni is a significant-whitespace language.
  Consequently, threads only need one bullet per line and their parentage and
  children are inferred from indentation.

- Kni does not have the `<>` operator for joining lines.
  Instead, Kni allows lines to wrap and requires an express solidus ``/``
  for line breaks or horizontal rule ``---`` for paragraph breaks.

- Kni does not have `=== title ===` notation and does not infer the `title.` prefix
  for `= subtitle` markers. Kni only has `@label` notation which must state
  the fully qualified label.

- Kni requires explicit prompting with the ``>`` marker.
  Early versions of Kni experimented with inferring the location of the marker,
  but the inferrence system did not play well with conditional threads
  that collect options, loops, or variable changes, and won’t play well
  with subroutines that collect options.

  ```ink
  + Apples
  + Oranges
  >

  + Umbrellas
  + Parasols
  >
  ```

  Ink appears to require all options to appear on the same level, and supports
  conditions directly on options. That probably accounts for how it gets
  by with implicitly prompting at the end of an option list.

- Kni’s {variable|text} is similar but not the same as Inkle’s Ink.

  - The default is the same ``{a|b|c}``, choosing "a", then "b", then "c" every
    time thereafter, always incrementing a variable with the same name as the
    underlying instruction label.

  - Once only lists don’t have a special marker, but you can leave the final
    variant empty like ``{a|b|c|}`` instead of ``{!a|b|c}``

  - Shuffles are the same, ``{~heads|tails}``.

  - Printing the value of a variable uses ``{(variable)}`` notation instead of
    merely ``{variable}``.

  - Kni also supports variable backed lists ``{(expression)|a|b|c}``, which
    like the default list stick on the last variant, and loops
    ``{@expression|a|b|c}``, which walk around the list.
    Kni has deterministic but arbitrary choices using the hash as well
    ``{#expression|a|b|c}``.

  - Kni’s conditional notation is like ``{(condition)?then|else}`` instead
    of ``{condition: then}``, and works for comparison operators like
    ``{(health>10)? | very much alive| hurting}``.
    By omitting the then and else clauses, a condition can apply, skipping
    to the end of the current thread.

- Kni’s notation for conditional options is slightly different.

  ```kni
  + {seen.clue} Accuse Mr.\ Jefferson.
  ```

  Kni also supports "condition and consequence" prefixes, like this
  example that will only show an option if the player has an arrow,
  and will consequently take that arrow if selected.

  ```kni
  + {-arrow}
    [You s[S]hoot an arrow[.]]
    {~ and hit the target, winning 1 gold piece!
    {+gold} {+score} ->range||}
    and miss.
  ```

  And also, Kni supports simple "consequence" notation, like this
  example that echanges gold for arrows. The `+3arrow` consequence does not
  have a corresponding condition.

  ```kni
  + {-gold} {+3arrow}
    [You b[B]uy 3 arrows for a gold piece. ]
  ```

- Kni has a notation like `~` bulleted blocks, except bulleted `!` and
  can as yet only contain assignment expressions and no other declarations.
  Kni also supports `{+gold}` and `{=10 hearts}` style expressions
  for assigning or mutating state inline with the narrative.

- The compiled JSON and the virtual machine that runs it are entirely
  different.

Kni is missing many things available to Ink.

- Kni does not have enumerations or other typed variable declarations.
  In only supports 32 bit integers.

- Labels are not variables. You can’t write a label to a variable and divert to
  it by that variable name.

- Kni does not yet support modules.

- Kni does not support defining functions for use in expressions.

- Kni does not support calling out to game logic. This is not likely to
  change. Games should bind to Ink narrative by watching the variable bag.

Yet Kni has some features that Ink leaves out.
Ink’s smallness is a virtue for keeping the language easy to pick up for
non-programmers, whereas I’ve made Kni selfishly as a hybrid writer and
coder.

- Kni supports second person options using a special case of Ink’s bracket
  notation.

  ```
  # Ink style option
  + Hello [back!] right back to you!

  # Abbreviated Ink style option
  + [North. ] You head north.

  # Second person variant illustrating inner bracket.
  # [A    [Q] QA          ]
  + [You b[B]uy an arrow. ]

  # Second person with alternating question-specific threads, and a trailing
  # answer that continues from the question with alternate punctuation.
  # [A    [Q] QA          [Q]] A
  + [You s[S]hoot an arrow[.]], scoring a {~hit|miss}!

  # [Q     ] A
  + [Quit. ] <-
  >
  ```

- Kni can collect options through nested conditional threads.

- Kni has subroutines. The ``{->label}`` is instructs the engine both to go
  to label, but also to return here after exhausting that narrative.

- Kni uses a ``<-`` operator to terminate a narrative (and return to the
  calling narrative if there is one) instead of goto with a special label, like
  Ink’s ``-> END``.

- Kni has operators for biased random numbers, hilbert curves, and hashing
  that suit it for gambling games and deterministic procedurally generated
  narrative.

All of this is subject to change from major version to major version.
I’m rapidly leaving major versions behind, so the stories written for them will
continue to work, but the language continues to evolve.
