import { useCallback, useContext, useMemo } from 'react'
import { RouteContext } from '@delta62/micro-router'
import { Form, FormItem, FieldValues, Validator } from '@delta62/micro-form'
import styles from './choose-game-page.module.scss'

let validateGameId: Validator = value => {
  let matches = /^\d{7}-[a-z]{4}$/.test(value)

  if (matches) {
    return false
  } else {
    return 'invalid game id'
  }
}

export let ChooseGamePage = () => {
  let { setPath } = useContext(RouteContext)

  let onSubmit = useCallback(
    (fields: FieldValues) => {
      let gameId = fields.game
      setPath(`/game/${gameId}`)
    },
    [setPath]
  )

  let classNames = useMemo(
    () => ({
      form: styles.form,
      field: styles.field,
      label: styles.label,
    }),
    []
  )

  return (
    <div className={styles.page}>
      <h1>Join a game</h1>
      <Form onSubmit={onSubmit} classNames={classNames}>
        <FormItem
          type="text"
          name="game"
          label="Game ID:"
          placeholder="1234567-abcd"
          validate={validateGameId}
        />
        <FormItem type="submit" label="Join" />
      </Form>
    </div>
  )
}
