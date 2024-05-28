import asyncio
import os
import logging


from aiogram import Bot, Dispatcher
from aiogram.types import Message
from aiogram.enums.parse_mode import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage

from handlers import router
from core.handlers.basic import get_start
from core.settings import settings


async def start_bot(bot: Bot):
    await bot.send_message(settings.bots.admin_id, text="бот запущен")


async def stop_bot(bot: Bot):
    await bot.send_message(settings.bots.admin_id, text="бот остановлен")



async def get_start(message: Message, bot: Bot):
    await bot.send_message(message.from_user.id, f'<b>Привет {message.from_user.first_name}. Рад тебя видеть!</b>')
    await message.answer(f'<s>Привет {message.from_user.first_name}. Рад тебя видеть!</s>')
    await message.reply(f'<tg-spoiler>Привет {message.from_user.first_name}. Рад тебя видеть!</tg-spoiler>')

    
    

async def start():
    
    logging.basicConfig(level=logging.INFO,
                        format="%(asctime)s -[%(levelname)s] - %(name)s -"
                          "(%(filename)s).%(funcName)s(%(lineno)d) - %(message)s")

    bot = Bot(token=settings.bots.bot_token, parse_mode='HTML')

    dp = Dispatcher(storage=MemoryStorage())
    dp.message.register(get_start)
    dp.startup.register(start_bot)
    dp.shutdown.register(stop_bot)
    dp.include_router(router)

    try:
        await bot.delete_webhook(drop_pending_updates=True)
        await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())
    finally:
        await bot.session.close()



if __name__ == "__main__":
   asyncio.run(start())
