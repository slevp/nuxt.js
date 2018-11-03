import NuxtCommand from './command'
import { indent, foldLines, startSpaces, optionSpaces } from './utils/formatting'

export default async function listCommands(_commands) {
  _commands = await Promise.all(
    Object.keys(_commands).map(cmd => NuxtCommand.load(cmd))
  )
  let maxLength = 0
  const commandsHelp = []
  for (const name in _commands) {
    commandsHelp.push([_commands[name].usage, _commands[name].description])
    maxLength = Math.max(maxLength, _commands[name].usage.length)
  }

  const _cmmds = commandsHelp.map(([cmd, description]) => {
    const i = indent(maxLength + optionSpaces - cmd.length)
    return foldLines(
      cmd + i + description,
      startSpaces + maxLength + optionSpaces * 2,
      startSpaces + optionSpaces
    )
  }).join('\n')

  const usage = foldLines(`Usage: nuxt <command> [--help|-h]`, startSpaces)
  const cmmds = foldLines(`Commands:`, startSpaces) + '\n\n' + _cmmds

  process.stderr.write(`${usage}\n\n${cmmds}\n\n`)
}
