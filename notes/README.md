# Thinking outside the box
Many times, thinking outside of the box is required. 
It can be required because the easiest way to solve the problem can be terribly slow or just a bad way of representing the data.

Take for example 2021, day 6.

## 2021-6

> Complete task description on [adventofcode.com](https://adventofcode.com/2021/day/6).

### Task
***Input***: 

List of comma seperated numbers
```
3,4,3,1,2
```
***Task***: 

Each number from the `input` represents a fish. The number is the days until that fish will reproduce. (So the fish will reproduce the day that the number gets to `0`).

When a fish reproduces, its internal timer will reset to `6`. (So it will not reproduce the next `6` days, and reproduce again the `7`th day).
A newly born fish will reset to `8`.

***Output***: 

How many fish will there be after `80` days?

### First thought
**Data representation**

Maybe we continue the list we get as input. We will use a `for-loop` to represent the days, and an array of numbers to represent the fishes; each number is the internal timer of one of the fishes. 

**Daily rythm**

Every day, each fish will reproduce or get closer to reproduction. Each day, we will loop over all numbers in the array.

```py
fishes = [fishTimer for fishTimer in input]
dayCount = 80

for (day from 0 to dayCount)
    for (fish in fishes)
        # Reproduce or get closer to reproduction
    endfor
endfor
```

Every time a timer hits `0`, the fish should reproduce. Otherwise, the fish's gets closer to reproduction. This can be caught by an `if-statement`.

**Reproduction** will reset the timer of the current fish to `6` (as described in the problem), and another fish will be born with its timer set to `8`. In our model, this is done by: setting the current entry in the array to `6`, and adding a new entry to the array with a value of `8`.

Each fish will **get closer to reproduction**. Every "timer" will decrease by one, so we decrement every value in the array by one. 

```py
if (fish is 0)
    # Reproduce
    fish = 6
    to fishes add 8
else
    # Get closer to reproduction
    fish = fish - 1
endif
```

**Output** 

The output should be the number of fish after `80` days. Since we represented each fish with: a number in the fishes array, our answer is the amount of numbers that is in our array.

Our complete code will now look something like this:
```py
int[] fishes = [fishTimer for fishTimer in input]
int dayCount = 80

for (day from 0 to dayCount)
    for (fish in fishes)
        if (fish is 0)
            # Reproduce
            fish = 6
            to fishes add 8
        else
            # Get closer to reproduction
            fish = fish - 1
        endif
    endfor
endfor

return len(fishes)
```

### The catch
Depending on the programming language, running this code will probably be fine. With the actual input of `300` fishes, we will end up with around `400000` fishes after `80` days. 

Part 2 will be our next problem. The question is exactly the same, although we should now calculate the population of the fishes after `256` days. When we try to run our code from part 1, we will probably get an error. 


Why would you ask? Well, lets do a **quick and dirty calculation**:

> If you want, you can skip the calculation

Lets say all fishes would all start with an internal timer of `6` (most of them will actually start earlier, but: quick and dirty). That means that we will first reproduce on day `6`, where the amount of fishes will be doubled from `300` to `600`.

Lets say that each fish will reproduce on average once every `7` days (since half of the fish will reproduce after `6` days, the other half after `8` days). This means that for the remaining `250` days, the fish will reproduce about `250 / 7` is about 35 times (rounded down). Every time they reproduce, the amount of fish double. 

Therefore, each starting fish will be the great-great-great-(...)-grandparent of about `2^35 = 34359738368` fish, or about `3 * 10^10`. 

Doing this for all 300 fish, we would end up with about `300 * 3 * 10^10 = 9 * 10 ^ 12` fish. Therefore, our list of fish will be very, very long for the days further on. Since we loop over every fish every day, this will take a long time, as well as a lot of memory.

Thats why we will probably get an error.

### Outside of the box
> To find a solution, we have to think outside the box. Our first thought was to represent our data in the same way as the input gave us the data. But what if we don't?

Our array of fishes will have a lot of integers. But what will the array actually look like?

After a couple of days, fishes will have reproduced. 

That means that new `8`'s will be added to the array. Also, the starting fishes will be reset to `6`'s. The next days, these `8`'s and `6`'s will slowly decrement until they reach `0`, and will reproduce again. 

That means that new `8`'s will be added to the array. Also, the starting fishes will be reset to `6`'s. The next days, these `8`'s and `6`'s will slowly decrement until they reach `0`, and will reproduce again. 

Do you notice something? Every number will be between `0` and `8`! So our array will have lots of `0`'s, `1`'s, `2`'s etc. That means that storing each fish individually will make for loads and loads of duplicates!

### The solution
Now that we found a flaw in our program, we can try to solve this by representing our data in another way. Let's just count the amount of `0`'s and store them, as well as the amount of `1`'s until `8`'s. This can be easily done in an array, where each index will be between `0` and `8`, and each value will represent the amount of fishes that have that index amount of days left before reproducing (again).

But how will we now perform the daily rythm? Well, just to rehearse:

Every day, for every fish, every time a timer hits `0`, the fish should reproduce. Otherwise, the fish's gets closer to reproduction.

To not let different days not interfer, we can use a clean array `newFishes` with all `0`'s in all places for each new day. When all calculations have been done, we can replace the `fishes` array with the `newFishes` array.

```py
int[] fishes = [0 for 0 to 9] # not including 9
int dayCount = 256

for (day from 0 to dayCount)
    for ([fishCount, index] in fishes)
        int[] newFishes = [0 for 0 to 9] # not including 9

        # Reproduce or get closer to reproduction

        fishes = newFishes
    endfor
endfor

return len(fishes)
```

Now that this structure is done, lets first look at **getting closer to reproduction**:

All fishes get one day closer to reproduction. That means that every fish that is currently at e.g. index `5`, should be counted at index `4` after this day. This happens for all fish. Therefore, all fishes counted at a certain index, should be counted at one index lower the next day (except for the fish at index `0`).

```
newFishes[index - 1] += fishes[index];
```

Then comes the part of **reproduction**:

Every fish that is at 0, will next set its timer to `6`. Also, a new fish will be born with its timer at `8`. This happens for all fish that reproduce. Therefore, for the next day, the number of fishes at index `0` should be added to index `6` (have reproduced) *and* added to index `8` (newly born). 

```
newFishes[6] += fishes[0];
newFishes[8] += fishes[0];
```

At the end we should output the total amount of fishes. This is now the sum of all the fishes at the different indices.

Now our complete program should look something like this:


```py
int[] fishes = [0 for 0 to 9] # not including 9
int dayCount = 256

for (day from 0 to dayCount)
    for ([fishCount, index] in fishes)
        int[] newFishes = [0 for 0 to 9] # not including 9

        if (index is 0)
            # Reproduce
            newFishes[6] += fishes[0];
            newFishes[8] += fishes[0];
        else
            # Get closer to reproduction
            newFishes[index - 1] += fishes[index];
        endif

        fishes = newFishes
    endfor
endfor

return sum([fishCount for fishCount in fishes])
```

TODO: Add summary